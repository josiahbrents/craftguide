importScripts('ench_data.js','anvil_core.js');
onmessage=e=>{const {id,specs}=e.data;try{postMessage({id,results:specs.map(s=>anvilSolve(s))})}catch(err){postMessage({id,error:String(err&&err.message||err)})}};
