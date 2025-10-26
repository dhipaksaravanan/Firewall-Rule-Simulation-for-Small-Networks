import React, { useState } from 'react';
import { Shield, Plus, Trash2, Play, AlertCircle, CheckCircle, XCircle, Download, Upload } from 'lucide-react';

export default function FirewallSimulator() {
  const [rules, setRules] = useState([
    { id: 1, action: 'ALLOW', protocol: 'TCP', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '80', priority: 1 },
    { id: 2, action: 'DENY', protocol: 'TCP', srcIp: '0.0.0.0/0', dstIp: '10.0.0.5', port: '22', priority: 2 },
    { id: 3, action: 'ALLOW', protocol: 'UDP', srcIp: '192.168.1.0/24', dstIp: '8.8.8.8', port: '53', priority: 3 }
  ]);
  
  const [testPacket, setTestPacket] = useState({
    protocol: 'TCP',
    srcIp: '192.168.1.10',
    dstIp: '10.0.0.5',
    port: '80'
  });
  
  const [simulationResult, setSimulationResult] = useState(null);
  const [nextId, setNextId] = useState(4);

  const addRule = () => {
    const newRule = {
      id: nextId,
      action: 'ALLOW',
      protocol: 'TCP',
      srcIp: '0.0.0.0/0',
      dstIp: '0.0.0.0/0',
      port: '0',
      priority: rules.length + 1
    };
    setRules([...rules, newRule]);
    setNextId(nextId + 1);
  };

  const deleteRule = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id, field, value) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const ipMatch = (packetIp, ruleIp) => {
    if (ruleIp === '0.0.0.0/0') return true;
    
    if (ruleIp.includes('/')) {
      const [network, bits] = ruleIp.split('/');
      const maskBits = parseInt(bits);
      const packetParts = packetIp.split('.').map(Number);
      const networkParts = network.split('.').map(Number);
      
      let matchingBits = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 7; j >= 0; j--) {
          if (matchingBits >= maskBits) return true;
          const packetBit = (packetParts[i] >> j) & 1;
          const networkBit = (networkParts[i] >> j) & 1;
          if (packetBit !== networkBit) return false;
          matchingBits++;
        }
      }
      return true;
    }
    
    return packetIp === ruleIp;
  };

  const simulatePacket = () => {
    const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
    
    for (const rule of sortedRules) {
      const protocolMatch = rule.protocol === 'ANY' || rule.protocol === testPacket.protocol;
      const srcMatch = ipMatch(testPacket.srcIp, rule.srcIp);
      const dstMatch = ipMatch(testPacket.dstIp, rule.dstIp);
      const portMatch = rule.port === '0' || rule.port === testPacket.port;
      
      if (protocolMatch && srcMatch && dstMatch && portMatch) {
        setSimulationResult({
          action: rule.action,
          matchedRule: rule,
          reason: `Matched Rule #${rule.priority}: ${rule.action} ${rule.protocol} ${rule.srcIp} → ${rule.dstIp}:${rule.port}`
        });
        return;
      }
    }
    
    setSimulationResult({
      action: 'DENY',
      matchedRule: null,
      reason: 'No matching rule found - Default DENY policy'
    });
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'firewall-rules.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importRules = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setRules(imported);
          const maxId = Math.max(...imported.map(r => r.id), 0);
          setNextId(maxId + 1);
        } catch (error) {
          alert('Error importing rules: Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Firewall Rule Simulator</h1>
          </div>
          <p className="text-blue-200">Configure firewall rules and test packet filtering for small networks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Firewall Rules Section */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Firewall Rules</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportRules}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition text-sm"
                  title="Export rules to JSON"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <label className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition cursor-pointer text-sm">
                  <Upload className="w-4 h-4" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importRules}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={addRule}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {rules.length === 0 ? (
                <div className="text-center py-8 text-blue-200">
                  No rules configured. Click "Add Rule" to create your first firewall rule.
                </div>
              ) : (
                rules.map((rule) => (
                  <div key={rule.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400 transition">
                    <div className="grid grid-cols-6 gap-3 items-center">
                      <div>
                        <label className="text-xs text-blue-200 block mb-1">Priority</label>
                        <input
                          type="number"
                          value={rule.priority}
                          onChange={(e) => updateRule(rule.id, 'priority', parseInt(e.target.value) || 1)}
                          className="w-full bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-blue-200 block mb-1">Action</label>
                        <select
                          value={rule.action}
                          onChange={(e) => updateRule(rule.id, 'action', e.target.value)}
                          className="w-full bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 focus:border-blue-400 focus:outline-none"
                        >
                          <option value="ALLOW">ALLOW</option>
                          <option value="DENY">DENY</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-blue-200 block mb-1">Protocol</label>
                        <select
                          value={rule.protocol}
                          onChange={(e) => updateRule(rule.id, 'protocol', e.target.value)}
                          className="w-full bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 focus:border-blue-400 focus:outline-none"
                        >
                          <option value="TCP">TCP</option>
                          <option value="UDP">UDP</option>
                          <option value="ICMP">ICMP</option>
                          <option value="ANY">ANY</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-blue-200 block mb-1">Source IP</label>
                        <input
                          type="text"
                          value={rule.srcIp}
                          onChange={(e) => updateRule(rule.id, 'srcIp', e.target.value)}
                          className="w-full bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 focus:border-blue-400 focus:outline-none"
                          placeholder="192.168.1.0/24"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-blue-200 block mb-1">Dest IP</label>
                        <input
                          type="text"
                          value={rule.dstIp}
                          onChange={(e) => updateRule(rule.id, 'dstIp', e.target.value)}
                          className="w-full bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 focus:border-blue-400 focus:outline-none"
                          placeholder="10.0.0.5"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-blue-200 block mb-1">Port</label>
                          <input
                            type="text"
                            value={rule.port}
                            onChange={(e) => updateRule(rule.id, 'port', e.target.value)}
                            className="w-full bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 focus:border-blue-400 focus:outline-none"
                            placeholder="80"
                          />
                        </div>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="bg-red-500 hover:bg-red-600 p-2 rounded text-white transition"
                          title="Delete rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Test Packet Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Test Packet</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-blue-200 block mb-2">Protocol</label>
                  <select
                    value={testPacket.protocol}
                    onChange={(e) => setTestPacket({...testPacket, protocol: e.target.value})}
                    className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-blue-200 block mb-2">Source IP</label>
                  <input
                    type="text"
                    value={testPacket.srcIp}
                    onChange={(e) => setTestPacket({...testPacket, srcIp: e.target.value})}
                    className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="192.168.1.10"
                  />
                </div>

                <div>
                  <label className="text-sm text-blue-200 block mb-2">Destination IP</label>
                  <input
                    type="text"
                    value={testPacket.dstIp}
                    onChange={(e) => setTestPacket({...testPacket, dstIp: e.target.value})}
                    className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="10.0.0.5"
                  />
                </div>

                <div>
                  <label className="text-sm text-blue-200 block mb-2">Destination Port</label>
                  <input
                    type="text"
                    value={testPacket.port}
                    onChange={(e) => setTestPacket({...testPacket, port: e.target.value})}
                    className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="80"
                  />
                </div>

                <button
                  onClick={simulatePacket}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition"
                >
                  <Play className="w-5 h-5" />
                  Simulate Packet
                </button>
              </div>
            </div>

            {/* Results Section */}
            {simulationResult && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-4">Simulation Result</h2>
                
                <div className={`rounded-lg p-4 ${
                  simulationResult.action === 'ALLOW' 
                    ? 'bg-green-500/20 border border-green-500' 
                    : 'bg-red-500/20 border border-red-500'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {simulationResult.action === 'ALLOW' ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400" />
                    )}
                    <span className={`text-2xl font-bold ${
                      simulationResult.action === 'ALLOW' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {simulationResult.action}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-white">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{simulationResult.reason}</p>
                  </div>
                  
                  {simulationResult.matchedRule && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-blue-200">Rule Details:</p>
                      <div className="mt-1 text-xs text-white font-mono">
                        {simulationResult.matchedRule.protocol} {simulationResult.matchedRule.srcIp} → {simulationResult.matchedRule.dstIp}:{simulationResult.matchedRule.port}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-blue-300 font-semibold mb-2">Rule Evaluation</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Rules evaluated by priority (lower = higher)</li>
                <li>• First matching rule determines action</li>
                <li>• Default deny if no rules match</li>
              </ul>
            </div>
            <div>
              <h4 className="text-blue-300 font-semibold mb-2">IP Notation</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• CIDR: 192.168.1.0/24 (256 addresses)</li>
                <li>• Wildcard: 0.0.0.0/0 (any IP)</li>
                <li>• Port 0 matches any port</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/20 rounded border border-blue-400/30">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">💡 Tip:</strong> Use Export/Import to save and load your firewall configurations as JSON files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
