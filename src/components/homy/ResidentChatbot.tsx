import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { callHomy, pollForAIResponse } from "@/lib/homyClient";
import { Hash } from 'viem';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ResidentChatbot() {
  // State to store chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State to manage user input
  const [input, setInput] = useState("");
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);
  // State to store error messages, if any
  const [error, setError] = useState<string | null>(null);

  // Function to handle message submission
  const handleSubmit = async () => {
    if (!input.trim()) return; // Ignore if input is empty

    // Add the user's message to the chat
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    setIsLoading(true); // Set loading state
    setError(null); // Reset error state

    try {
      console.log("Submitting request to Homy with input:", input);

      // Call the Homy contract with predefined model IDs and user input
      const hash: Hash = await callHomy(11, 50, input);
      console.log("Transaction hash returned:", hash);

      // Fetch the transaction receipt to verify the transaction
      const receipt = await fetchTransactionReceipt(hash);
      console.log("Transaction receipt:", receipt);

      // Check for logs in the transaction receipt
      if (!receipt || !receipt.logs || receipt.logs.length === 0) {
        throw new Error('Invalid transaction receipt: No logs found');
      }

      // Extract requestId from the transaction logs
      const requestId = BigInt(receipt.logs[0].topics[1]);
      console.log("Extracted requestId from transaction logs:", requestId);

      // Add a placeholder message while the AI response is being processed
      setMessages(prev => [...prev, { role: 'assistant', content: 'Processing your request. This may take a few minutes...' }]);

      // Poll for the AI response using the requestId
      const aiResponse = await pollForAIResponse(requestId);
      console.log("AI response received:", aiResponse);

      // Replace the placeholder message with the actual AI response
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 && msg.role === 'assistant' ? { role: 'assistant', content: aiResponse } : msg
      ));
    } catch (error) {
      // Handle any errors during the process
      console.error("Error calling Homy:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." }]);
    } finally { 
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to fetch the transaction receipt from the backend API
  const fetchTransactionReceipt = async (hash: Hash) => {
    try {
      console.log("Fetching transaction receipt for hash:", hash);
      const response = await fetch(`/api/transaction/${hash}`);

      if (!response.ok) {
        throw new Error('Failed to fetch transaction receipt');
      }

      const receipt = await response.json();
      console.log("Transaction receipt fetched:", receipt);
      return receipt;
    } catch (error) {
      // Handle any errors during the receipt fetch
      console.error("Error fetching transaction receipt:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      {/* Chat message display area */}
      <div className="h-[300px] border rounded p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
            <strong>{message.role === 'user' ? 'You: ' : 'Homy: '}</strong>{message.content}
          </div>
        ))}
      </div>
      {/* Input field and send button */}
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
      {/* Error message display */}
      {error && (
        <div className="text-red-500">{error}</div>
      )}
    </div>
  );
}
