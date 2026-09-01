import { runPlaytestCase052 } from './playtestCase052';

async function main() {
  const result = await runPlaytestCase052();
  console.log('\n--- STANDALONE PLAYTEST METRICS ---');
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
