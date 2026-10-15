import { notFound } from 'next/navigation';
import Link from 'next/link';

import { API_CATALOG } from "@/lib/api-catalog";

export async function generateStaticParams() {
  return API_CATALOG.map(({ id }) => ({ id }));
}

// Force static generation
export const dynamicParams = false;

export default async function APIDocumentationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = API_CATALOG.find(entry => entry.id === id);

  if (!api) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          ← Back to DevHub
        </Link>

        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{api.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{api.name}</h1>
              <p className="text-slate-400">{api.category} API</p>
            </div>
          </div>

          <p className="text-slate-300 text-lg mb-8">{api.longDescription || api.description}</p>

          <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">API Endpoint</h2>
            <code className="block bg-slate-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
              {api.url}
            </code>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Endpoints</h2>
            <div className="space-y-4">
              {api.tools.map((endpoint, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{endpoint.name}</h3>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{endpoint.method}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
            <div className="space-y-4">
              <div>
                <p className="text-slate-300 text-sm mb-2">1. Make a POST request to the API endpoint:</p>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl -X POST ${api.url} \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'`}</code>
                </pre>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-2">2. Call a specific tool:</p>
                <pre className="bg-slate-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl -X POST ${api.url} \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "${api.tools[0].name}",
      "arguments": {}
    }
  }'`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
