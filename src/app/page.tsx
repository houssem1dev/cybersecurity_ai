'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { CvssModal } from '@/components/CvssModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ChatMessage } from '@/lib/groq';
import { SecurityScenario } from '@/lib/templates';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [currentModel, setCurrentModel] = useState<string>('gemma2-9b-it');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [serverKeyConfigured, setServerKeyConfigured] = useState<boolean>(false);

  const [isCvssOpen, setIsCvssOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Check health and load saved settings on mount
  useEffect(() => {
    // Check local storage for custom key and model preference
    const savedKey = localStorage.getItem('cyberai_groq_key');
    if (savedKey) setCustomApiKey(savedKey);

    const savedModel = localStorage.getItem('cyberai_groq_model');
    if (savedModel) setCurrentModel(savedModel);

    // Check server key status
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerKeyConfigured(Boolean(data.serverKeyConfigured));
      })
      .catch((err) => {
        console.error('Health check failed:', err);
      });
  }, []);

  const handleSaveCustomKey = (key: string) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('cyberai_groq_key', key);
    } else {
      localStorage.removeItem('cyberai_groq_key');
    }
  };

  const handleSelectModel = (model: string) => {
    setCurrentModel(model);
    localStorage.setItem('cyberai_groq_model', model);
  };

  const handleClearChat = () => {
    if (confirm('Clear the current security analysis history?')) {
      setMessages([]);
      setStreamingText('');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isStreaming) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setInputText('');
    setIsStreaming(true);
    setStreamingText('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          mode: selectedMode,
          model: currentModel,
          apiKeyOverride: customApiKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMessage = errorData.error || `Server responded with status ${response.status}`;
        throw new Error(errMessage);
      }

      if (!response.body) {
        throw new Error('No response stream received from server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAssistantResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullAssistantResponse += chunk;
        setStreamingText(fullAssistantResponse);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fullAssistantResponse }]);
      setStreamingText('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown analysis error occurred.';
      const fallbackContent = `### Analysis Failed\n\n**Error:** ${errorMessage}\n\n*Remediation:* Please verify your \`GROQ_API_KEY\` in Settings or project environment variables.`;
      setMessages((prev) => [...prev, { role: 'assistant', content: fallbackContent }]);
      setStreamingText('');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSelectScenario = (scenario: SecurityScenario) => {
    setSelectedMode(scenario.mode);
    setInputText(scenario.prompt);
  };

  const handleInsertCvssVector = (vector: string, score: number, severity: string) => {
    const cvssSnippet = `\n\n**CVSS v3.1 Metric String:** \`${vector}\`\n**Base Score:** ${score} (${severity})\nPlease evaluate this metric string in your risk analysis.`;
    setInputText((prev) => (prev ? prev + cvssSnippet : cvssSnippet.trim()));
  };

  const handleExportReport = () => {
    if (messages.length === 0) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let reportContent = `# CYBERAI DEFENSIVE SECURITY ASSESSMENT REPORT\n`;
    reportContent += `Generated: ${new Date().toUTCString()}\n`;
    reportContent += `Operational Mode: ${selectedMode.toUpperCase()}\n`;
    reportContent += `Model Engine: ${currentModel}\n\n`;
    reportContent += `---\n\n`;

    messages.forEach((msg, idx) => {
      reportContent += `## ${msg.role === 'user' ? 'Target Input / Telemetry' : 'Defensive Assessment & Remediation'}\n\n`;
      reportContent += `${msg.content}\n\n`;
      reportContent += `---\n\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Security-Assessment-Report-${timestamp}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      <Header
        serverKeyConfigured={serverKeyConfigured}
        hasCustomKey={Boolean(customApiKey)}
        onOpenCvss={() => setIsCvssOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearChat={handleClearChat}
        onExportReport={handleExportReport}
        canExport={messages.length > 0}
        currentModel={currentModel}
      />

      <div className="main-content">
        <Sidebar
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          onSelectScenario={handleSelectScenario}
        />

        <ChatArea
          messages={messages}
          streamingText={streamingText}
          isStreaming={isStreaming}
          inputText={inputText}
          onInputChange={setInputText}
          onSendMessage={() => handleSendMessage()}
          selectedMode={selectedMode}
          onOpenCvss={() => setIsCvssOpen(true)}
          onSelectPrompt={(prompt) => {
            setInputText(prompt);
          }}
        />
      </div>

      <CvssModal
        isOpen={isCvssOpen}
        onClose={() => setIsCvssOpen(false)}
        onInsertVector={handleInsertCvssVector}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        serverKeyConfigured={serverKeyConfigured}
        currentModel={currentModel}
        onSelectModel={handleSelectModel}
        customApiKey={customApiKey}
        onSaveCustomKey={handleSaveCustomKey}
      />
    </div>
  );
}
