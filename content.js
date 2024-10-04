// content.js
function getVideoTranscript() {
  const transcriptContainer = document.querySelector(".ytp-caption-segment");
  let transcript = '';

  if (transcriptContainer) {
      transcript = transcriptContainer.innerText;
      console.log("Transcript retrieved:", transcript);
  } else {
      transcript = "No captions available for this video.";
      console.warn(transcript);
  }

  return transcript;
}

// // content.js
// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Summarizer extension installed!");
});

// Event listener for the summarize button
document.getElementById("summarizeBtn").addEventListener("click", handleSummarizeClick);

// Function to handle the summarize button click
function handleSummarizeClick() {
  console.log("Button clicked!");
  queryActiveTab();
}

// Function to query the active tab
function queryActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
          console.error("Error querying tabs:", chrome.runtime.lastError);
          document.getElementById('summaryResult').innerText = "Error querying active tabs.";
          return;
      }

      if (tabs.length === 0) {
          console.error("No active tabs found.");
          document.getElementById('summaryResult').innerText = "No active tabs found.";
          return;
      }

      // Send message to content script to get the transcript
      chrome.tabs.sendMessage(tabs[0].id, { action: "getTranscript" }, handleTranscriptResponse);
  });
}

// Function to handle the response from the content script
function handleTranscriptResponse(response) {
  if (chrome.runtime.lastError) {
      console.error("Error getting transcript:", chrome.runtime.lastError);
      document.getElementById('summaryResult').innerText = "Error getting transcript.";
      return;
  }

  if (response && response.transcript) {
      console.log("Transcript received:", response.transcript);
      fetchSummary(response.transcript); // Fetch summary with the transcript
  } else {
      console.warn("No transcript in response:", response);
      document.getElementById('summaryResult').innerText = "Transcript not available.";
  }
}

// Function to call the summary API
async function fetchSummary(transcript) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key or fetch securely
  try {
      const response = await fetch(`https://gemini-summarization-api-url/summarize`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ text: transcript }),
      });

      if (!response.ok) {
          console.error("Error fetching summary:", response.statusText);
          document.getElementById('summaryResult').innerText = "Failed to fetch summary.";
          return;
      }

      const summary = await response.json();
      document.getElementById('summaryResult').innerText = summary.result || "No summary available.";
  } catch (error) {
      console.error("Fetch error:", error);
      document.getElementById('summaryResult').innerText = "An error occurred while fetching the summary.";
  }
}

