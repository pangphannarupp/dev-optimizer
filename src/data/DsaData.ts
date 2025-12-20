
export type DsaCategory = 'Big O' | 'Data Structures' | 'Algorithms';
export type DsaDifficulty = 'Basic' | 'Intermediate' | 'Advanced';

export interface DsaTopic {
  id: string;
  title: string;
  category: DsaCategory;
  difficulty: DsaDifficulty;
  description: string;
  complexity?: {
    time: string;
    space: string;
  };
  codeExample?: string;
  explanation?: string;
}

export const dsaTopics: DsaTopic[] = [
  // --- Big O ---
  {
    id: 'big-o',
    title: 'Big O Notation',
    category: 'Big O',
    difficulty: 'Basic',
    description: 'Big O notation is used to describe the performance or complexity of an algorithm.',
    explanation: `
Big O notation characterizes functions according to their growth rates: different functions with the same growth rate may be represented using the same O notation.

**Common Complexities:**
- **O(1)**: Constant time
- **O(log n)**: Logarithmic time
- **O(n)**: Linear time
- **O(n log n)**: Linearithmic time
- **O(n^2)**: Quadratic time
- **O(2^n)**: Exponential time
    `,
    codeExample: `
// O(1) - Constant
function isFirstElementNull(array) {
  return array[0] === null;
}

// O(n) - Linear
function containsValue(array, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) return true;
  }
  return false;
}
    `
  },

  // --- Data Structures (Basic) ---
  {
    id: 'arrays',
    title: 'Arrays',
    category: 'Data Structures',
    difficulty: 'Basic',
    description: 'A collection of items stored at contiguous memory locations.',
    complexity: { time: 'Access: O(1), Search: O(n)', space: 'O(n)' },
    codeExample: `
const arr = [1, 2, 3, 4, 5];

// Access
console.log(arr[0]); // 1

// Insertion (push)
arr.push(6);

// Deletion (pop)
arr.pop();
    `
  },
  {
    id: 'linked-list',
    title: 'Linked Lists',
    category: 'Data Structures',
    difficulty: 'Basic',
    description: 'A linear data structure where elements are not stored at contiguous memory locations.',
    complexity: { time: 'Access: O(n), Insert/Del: O(1)', space: 'O(n)' },
    codeExample: `
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }
}
    `
  },
  {
    id: 'stack',
    title: 'Stack',
    category: 'Data Structures',
    difficulty: 'Basic',
    description: 'LIFO (Last In First Out) data structure.',
    complexity: { time: 'Push/Pop: O(1)', space: 'O(n)' },
    codeExample: `
class Stack {
  constructor() {
    this.items = [];
  }
  push(element) { this.items.push(element); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}
    `
  },
  {
    id: 'queue',
    title: 'Queue',
    category: 'Data Structures',
    difficulty: 'Basic',
    description: 'FIFO (First In First Out) data structure.',
    complexity: { time: 'Enqueue: O(1), Dequeue: O(1) (amortized)', space: 'O(n)' },
    codeExample: `
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) { this.items.push(element); }
  dequeue() { return this.items.shift(); } // O(n) in JS array, real Queue is O(1)
}
    `
  },

  // --- Data Structures (Intermediate) ---
  {
    id: 'hash-table',
    title: 'Hash Tables',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    description: 'Implements an associative array abstract data type, a structure that can map keys to values.',
    complexity: { time: 'Avg: O(1), Worst: O(n)', space: 'O(n)' },
    codeExample: `
const map = new Map();

// Insert
map.set('key1', 'value1');

// Access
console.log(map.get('key1'));

// Check 
console.log(map.has('key1'));
    `
  },
  {
    id: 'bst',
    title: 'Binary Search Tree',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    description: 'A rooted binary tree data structure with the key of each internal node being greater than all the keys in the respective node\'s left subtree and less than the ones in its right subtree.',
    complexity: { time: 'Avg: O(log n), Worst: O(n)', space: 'O(n)' },
    codeExample: `
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
    `
  },

  // --- Data Structures (Advanced) ---
  {
    id: 'graph',
    title: 'Graphs',
    category: 'Data Structures',
    difficulty: 'Advanced',
    description: 'A non-linear data structure consisting of nodes and edges.',
    complexity: { time: 'Adjacency List: O(V+E)', space: 'O(V+E)' },
    explanation: 'Graphs can be directed or undirected, weighted or unweighted. They are used to model pairwise relations between objects (e.g., social networks, maps).',
    codeExample: `
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1); // Undirected
  }
}
    `
  },
  {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    category: 'Data Structures',
    difficulty: 'Advanced',
    description: 'A tree-like data structure used to store a dynamic set or associative array where the keys are usually strings.',
    complexity: { time: 'Insert/Search: O(L) where L is key length', space: 'O(ALPHABET_SIZE * L * N)' },
    codeExample: `
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}
    `
  },

  // --- Algorithms (Basic) ---
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Algorithms',
    difficulty: 'Basic',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: { time: 'O(n^2)', space: 'O(1)' },
    codeExample: `
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}
    `
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'Algorithms',
    difficulty: 'Basic',
    description: 'Builds the final sorted array one item at a time.',
    complexity: { time: 'O(n^2)', space: 'O(1)' },
    codeExample: `
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}
    `
  },

  // --- Algorithms (Intermediate) ---
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    description: 'Search a sorted array by repeatedly dividing the search interval in half.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    codeExample: `
function binarySearch(arr, x) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (arr[m] === x) return m;
    if (arr[m] < x) l = m + 1;
    else r = m - 1;
  }
  return -1;
}
    `
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    description: 'Divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    codeExample: `
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [], l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) result.push(left[l++]);
    else result.push(right[r++]);
  }
  return result.concat(left.slice(l)).concat(right.slice(r));
}
    `
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    description: 'Divide and conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.',
    complexity: { time: 'Avg: O(n log n), Worst: O(n^2)', space: 'O(log n)' },
    codeExample: `
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
    `
  },

  // --- Algorithms (Advanced) ---
  {
    id: 'bfs',
    title: 'BFS (Breadth First Search)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'An algorithm for traversing or searching tree or graph data structures.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    codeExample: `
function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  const result = [];

  while (queue.length) {
    const vertex = queue.shift();
    result.push(vertex);

    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}
    `
  },
  {
    id: 'dfs',
    title: 'DFS (Depth First Search)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'An algorithm for traversing or searching tree or graph data structures.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    codeExample: `
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start); // Process node

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}
    `
  },
  {
    id: 'dp-fib',
    title: 'DP: Fabonacci (Memoization)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Dynamic Programming approach to calculate Fibonacci numbers.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    codeExample: `
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
    `
  }
];
