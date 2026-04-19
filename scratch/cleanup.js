const wait = (ms) => new Promise((res) => setTimeout(res, ms));

async function run() {
  while (true) {
    try {
      const res = await fetch('https://e-commerce-o2zc.onrender.com/api/cleanup');
      const text = await res.text();
      if (res.status === 200 && text.includes('deleted')) {
        console.log("SUCCESS:", text);
        break;
      }
      console.log("Waiting...", res.status);
    } catch(e) {
      console.log("Error:", e.message);
    }
    await wait(10000);
  }
}
run();
