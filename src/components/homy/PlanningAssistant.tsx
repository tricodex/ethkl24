import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { callHomy, getHomyResponse } from "@/lib/homyClient";

export function PlanningAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const hash = await callHomy(11, 50, `Generate a plan for: ${prompt}`);
      const receipt = await fetch(`/api/transaction/${hash}`);
      const { logs } = await receipt.json();
      const requestId = logs[0].topics[1];
      const aiResponse = await getHomyResponse(BigInt(requestId));
      setResponse(aiResponse);
    } catch (error) {
      console.error("Error calling Homy:", error);
      setResponse("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea 
        placeholder="Describe the task you need a plan for..." 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Generating Plan..." : "Generate Plan"}
      </Button>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Generated Plan:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}