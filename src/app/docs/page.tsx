import { BookOpen, Code2, Rocket, CheckCircle, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Choose Your API',
    description: 'Browse our collection of 5 APIs including Portfolio, Tech Blog, Art Blog, Tech Space, and MCP List Hub.',
    href: '/#apis'
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'Get Your Endpoint',
    description: 'Each API has a unique MCP endpoint URL. Find it in the API documentation or use the playground.',
    href: '/api/portfolio'
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Make Your First Request',
    description: 'Send a JSON-RPC 2.0 POST request to the endpoint with the method you want to call.',
    href: '/playground'
  }
];

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Standard Protocol',
    description: 'All APIs use the Model Context Protocol (MCP) - a standardized JSON-RPC 2.0 interface.'
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Always Available',
    description: 'All APIs are hosted on Vercel with 99.99% uptime and global CDN distribution.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Optimized for speed with minimal latency and efficient data transfer.'
  }
];

const codeExamples = [
  {
    language: 'cURL',
    code: `curl -X POST https://bookchaowalit-portfolio-frontend.vercel.app/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'`
  },
  {
    language: 'JavaScript',
    code: `const response = await fetch(
  'https://bookchaowalit-portfolio-frontend.vercel.app/api/mcp',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    })
  }
);
const data = await response.json();`
  },
  {
    language: 'Python',
    code: `import requests

response = requests.post(
  'https://bookchaowalit-portfolio-frontend.vercel.app/api/mcp',
  json={
    'jsonrpc': '2.0',
    'id': 1,
    'method': 'tools/list'
  }
)
data = response.json()`
  }
];

export default function DocsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          ← Back to DevHub
        </Link>

        <div className="max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Quick Start Guide</h1>
            <p className="text-slate-400 text-lg">Get started with DevHub APIs in 3 simple steps</p>
          </div>

          {/* Steps */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Getting Started</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Link key={index} href={step.href} className="block">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                            Step {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-slate-400 mb-2">{step.description}</p>
                        <span className="text-sm text-blue-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Why DevHub APIs?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Examples */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Code Examples</h2>
            <p className="text-slate-400 mb-6">
              All DevHub APIs use the MCP (Model Context Protocol) - a JSON-RPC 2.0 based protocol.
              Here&apos;s how to make your first API call:
            </p>

            <div className="space-y-6">
              {codeExamples.map((example, index) => (
                <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="bg-slate-900 px-6 py-3 border-b border-slate-700">
                    <span className="text-sm font-semibold text-white">{example.language}</span>
                  </div>
                  <pre tabIndex={0} className="p-6 overflow-x-auto text-sm">
                    <code className="text-green-400">{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Available Methods */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Available MCP Methods</h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-300 text-sm font-mono">GET</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">initialize</h3>
                    <p className="text-slate-400 text-sm">Initialize the MCP server connection. Returns server capabilities and protocol version.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-sm font-mono">GET</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">tools/list</h3>
                    <p className="text-slate-400 text-sm">List all available tools/functions provided by the API server.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-300 text-sm font-mono">POST</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">tools/call</h3>
                    <p className="text-slate-400 text-sm">Execute a specific tool with parameters. Returns the tool&apos;s output or result.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Response Format */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Response Format</h2>
            <p className="text-slate-400 mb-6">
              All API responses follow the JSON-RPC 2.0 specification:
            </p>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-900 px-6 py-3 border-b border-slate-700">
                <span className="text-sm font-semibold text-white">Example Response</span>
              </div>
              <pre tabIndex={0} className="p-6 overflow-x-auto text-sm">
                <code className="text-green-400">{`{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_projects",
        "description": "Get all projects from the portfolio",
        "inputSchema": {
          "type": "object",
          "properties": {}
        }
      }
    ]
  }
}`}</code>
              </pre>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Build?</h2>
            <p className="text-blue-100 mb-6">
              Try the interactive playground to test APIs directly in your browser.
            </p>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Rocket className="w-5 h-5" />
              Open Playground
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
