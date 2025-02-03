import { Octokit } from 'octokit';
import { configDotenv } from 'dotenv';
console.log(configDotenv()?.parsed?.ACCESSTOKEN);

const octokit = new Octokit({ auth: process.env.ACCESSTOKEN });

const { data: { login }, } = await octokit.rest.users.getAuthenticated();

// Github ID
console.log("Hello, %s", login);
