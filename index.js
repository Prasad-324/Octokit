import { Octokit } from "octokit";
import { configDotenv } from "dotenv";
console.log(configDotenv()?.parsed?.ACCESSTOKEN);

const octokit = new Octokit({ auth: process.env.ACCESSTOKEN });

const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();


// Github ID
console.log("Hello, %s", login);


// Get all repos
const repos = await octokit.request("GET /user/repos", {
  org: "ORG",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

// Each repo contributors
for (const repo of repos.data) {
  const contributors = await octokit.request(
    "GET /repos/{owner}/{repo}/contributors",
    {
      owner: repo?.owner?.login,
      repo: repo?.name,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  console.log("\nRepo: %s", repo?.name);
  contributors?.data.forEach(contributor => {
      console.log(contributor?.login);
  });
}

// Fetch branches for each repository
for (const repo of repos.data) {
  console.log(`Repo: ${repo.name}`);

  // Fetch branches for each repository
  const branches = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: repo.owner.login,
    repo: repo.name,
  });

  console.log("Branches:");
  branches.data.forEach(branch => {
    console.log(`- ${branch.name}`);
  });
}

// Fetch open pull requests for each repository
for (const repo of repos.data) {
  const pulls = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: repo.owner.login,
    repo: repo.name,
    state: "all",
  });

  console.log(`\nPull Requests for ${repo.name}:`);
  for (const pull of pulls.data) {
    console.log(`- Pull #${pull.number}: ${pull.title} ----> ${pull.state}` );

    // Fetch reviewers for each pull request
    const reviews = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner: repo.owner.login,
        repo: repo.name,
        pull_number: pull.number,
      }
    );

    console.log("\nReviewers:");
    reviews.data.forEach((review) => {
      console.log(`-- ${review.user.login} (Review Status: ${review.state})`);
    });
  }
}
