import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { callHomy, getHomyResponse } from "@/lib/homyClient";

export function ProposalWriter() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proposal, setProposal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Write a proposal for "${title}". Description: ${description}`;
      const hash = await callHomy(11, 50, prompt);
      const receipt = await fetch(`/api/transaction/${hash}`);
      const { logs } = await receipt.json();
      const requestId = logs[0].topics[1];
      const aiResponse = await getHomyResponse(BigInt(requestId));
      setProposal(aiResponse);
    } catch (error) {
      console.error("Error calling Homy:", error);
      setProposal("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Proposal Title" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea 
        placeholder="Proposal Description" 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Generating Proposal..." : "Generate Proposal"}
      </Button>
      {proposal && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Generated Proposal:</h3>
          <p>{proposal}</p>
        </div>
      )}
    </div>
  );
}