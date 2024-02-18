
# LLM Visualization (TR)

This is a fork of the original project. You can find the original repository here: [LLM-Viz Original Repository](https://github.com/bbycroft/llm-viz)


This project displays a 3D model of a working implementation of a GPT-style network. That
is, the network topology that's used in OpenAI's GPT-2, GPT-3, (and maybe GPT-4).

The first network displayed with working weights is a tiny such network, which sorts a small list
of the letters A, B, and C. This is the demo example model from Andrej Karpathy's
[minGPT](https://github.com/karpathy/minGPT) implementation.

The renderer also supports visualizing arbitrary sized networks, and works with the smaller gpt2
size, although the weights aren't downloaded (it's 100's of MBs).

## Running Locally

1. Install dependencies: `yarn`
1. Start the dev server: `yarn dev`
