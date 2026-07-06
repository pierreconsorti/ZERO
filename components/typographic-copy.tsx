"use client";

import { useEffect } from "react";

const skippedTags = new Set([
  "CODE",
  "INPUT",
  "KBD",
  "OPTION",
  "PRE",
  "SAMP",
  "SCRIPT",
  "SELECT",
  "STYLE",
  "TEXTAREA"
]);

function smartenCopy(value: string) {
  return value
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/(^|[\s([{])'(?=\S)/g, "$1‘")
    .replace(/'/g, "’")
    .replace(/(^|[\s([{])"(?=\S)/g, "$1“")
    .replace(/"/g, "”");
}

function shouldSkip(node: Node) {
  const element = node.parentElement;

  return !element || element.closest([...skippedTags].join(","));
}

function smartenTextNode(node: Node) {
  if (node.nodeType !== Node.TEXT_NODE || shouldSkip(node)) {
    return;
  }

  const current = node.textContent ?? "";
  const next = smartenCopy(current);

  if (next !== current) {
    node.textContent = next;
  }
}

function smartenTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    smartenTextNode(root);
    return;
  }

  const filter = window.NodeFilter;
  const walker = document.createTreeWalker(root, filter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldSkip(node) ? filter.FILTER_REJECT : filter.FILTER_ACCEPT;
    }
  });
  const nodes: Node[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach(smartenTextNode);
}

export function TypographicCopy() {
  useEffect(() => {
    smartenTree(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          smartenTextNode(mutation.target);
          return;
        }

        mutation.addedNodes.forEach(smartenTree);
      });
    });

    observer.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
