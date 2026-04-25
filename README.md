# n8n-nodes-plausible

This is an n8n community node for [Plausible Analytics](https://plausible.io/).

Plausible is a lightweight, open-source, privacy-friendly web analytics tool. This node lets you query your Plausible stats directly inside n8n workflows.

## Operations

- **Get Realtime Visitors** — Get the number of current visitors on your site
- **Get Aggregate Stats** — Get pageviews, visits, bounce rate, and visit duration for a time period
- **Get Breakdown** — Get stats broken down by page, country, browser, device, or source

## Credentials

You need a Plausible API key:
1. Log in to your Plausible account
2. Go to Settings → API Keys
3. Generate a new key and copy it
4. In n8n, add a new Plausible credential and paste the key

## Compatibility

Tested with n8n version 1.x and Plausible Cloud (plausible.io).
For self-hosted Plausible instances, update the Base URL in the credential settings.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Plausible API documentation](https://plausible.io/docs/stats-api)