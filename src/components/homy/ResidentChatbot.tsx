'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { callHomy, getHoMyResponse } from "@/lib/homyClient";
import { Hash } from 'viem';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ResidentChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const hash = await callHomy(11, 50, input);
      const receipt = await fetchTransactionReceipt(hash);
      if (!receipt || !receipt.logs || receipt.logs.length === 0) {
        throw new Error('Invalid transaction receipt');
      }
      const requestId = BigInt(receipt.logs[0].topics[1]);
      const aiResponse = await getHoMyResponse(requestId);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Error calling Homy:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactionReceipt = async (hash: Hash) => {
    const response = await fetch(`/api/transaction/${hash}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction receipt');
    }
    return response.json();
  };

  return (
    <div className="space-y-4">
      <div className="h-[300px] border rounded p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
            <strong>{message.role === 'user' ? 'You: ' : 'Homy: '}</strong>{message.content}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Textarea 
          placeholder="Ask Homy about estate information..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Thinking..." : "Send"}
        </Button>
      </div>
      {error && (
        <div className="text-red-500">{error}</div>
      )}
    </div>
  );
}