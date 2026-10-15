'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Code2, Terminal, Copy, Check, RefreshCw } from 'lucide-react';

import { API_CATALOG as APIS } from "@/lib/api-catalog";

const METHODS = [
  { name: 'List Tools', method: 'tools/list', params: {} },
  { name: 'Initialize', method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'DevHub Playground', version: '1.0.0' } } }
];

export default function PlaygroundPage() {
  const [selectedApi, setSelectedApi] = useState(APIS[0]);
  const [selectedMethod, setSelectedMethod] = useState(METHODS[0]);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const makeRequest = async () => {
    setLoading(true);
    try {
      const requestBody = {
        jsonrpc: '2.0',
        id: 1,
        method: selectedMethod.method,
        params: selectedMethod.params
      };

      const res = await fetch(selectedApi.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody, null, 2)
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }, null, 2));
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRequestPreview = () => {
    return JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: selectedMethod.method,
      params: selectedMethod.params
    }, null, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          ← Back to DevHub
        </Link>

        <div className="max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">API Playground</h1>
            <p className="text-slate-400 text-lg">Test MCP endpoints directly in your browser</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Panel */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Request</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* API Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Select API</label>
                  <select
                    value={selectedApi.id}
                    onChange={(e) => setSelectedApi(APIS.find(api => api.id === e.target.value)!)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {APIS.map(api => (
                      <option key={api.id} value={api.id}>{api.name}</option>
                    ))}
                  </select>
                </div>

                {/* Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Select Method</label>
                  <select
                    value={selectedMethod.name}
                    onChange={(e) => setSelectedMethod(METHODS.find(m => m.name === e.target.value)!)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {METHODS.map(method => (
                      <option key={method.name} value={method.name}>{method.name}</option>
                    ))}
                  </select>
                </div>

                {/* Endpoint URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Endpoint URL</label>
                  <div className="bg-slate-900 rounded-lg px-4 py-3 text-sm text-blue-400 font-mono break-all">
                    {selectedApi.url}
                  </div>
                </div>

                {/* Request Body Preview */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Request Body</label>
                  <pre className="bg-slate-900 rounded-lg p-4 text-sm text-green-400 overflow-x-auto font-mono">
                    {getRequestPreview()}
                  </pre>
                </div>

                {/* Execute Button */}
                <button
                  onClick={makeRequest}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Panel */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-semibold text-white">Response</h2>
                </div>
                {response && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              <div className="p-6 h-[600px] overflow-auto">
                {response ? (
                  <pre className="bg-slate-900 rounded-lg p-4 text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
                    {response}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Terminal className="w-16 h-16 mb-4 opacity-50" />
                    <p>Response will appear here</p>
                    <p className="text-sm mt-2">Click &quot;Send Request&quot; to test the API</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="mt-12 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Code Examples</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* cURL */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">cURL</h3>
                <pre className="bg-slate-900 rounded-lg p-4 text-sm text-green-400 overflow-x-auto font-mono">
                  <code>{`curl -X POST ${selectedApi.url} \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "${selectedMethod.method}",
    "params": ${JSON.stringify(selectedMethod.params)}
  }'`}</code>
                </pre>
              </div>

              {/* JavaScript */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">JavaScript (fetch)</h3>
                <pre className="bg-slate-900 rounded-lg p-4 text-sm text-blue-400 overflow-x-auto font-mono">
                  <code>{`const response = await fetch('${selectedApi.url}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: '${selectedMethod.method}',
    params: ${JSON.stringify(selectedMethod.params)}
  })
});
const data = await response.json();
console.log(data);`}</code>
                </pre>
              </div>

              {/* Python */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Python (requests)</h3>
                <pre className="bg-slate-900 rounded-lg p-4 text-sm text-yellow-400 overflow-x-auto font-mono">
                  <code>{`import requests

response = requests.post('${selectedApi.url}', json={
    'jsonrpc': '2.0',
    'id': 1,
    'method': '${selectedMethod.method}',
    'params': ${JSON.stringify(selectedMethod.params)}
})
data = response.json()
print(data)`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
