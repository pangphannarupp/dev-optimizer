import{j as e,aZ as O,aB as A,V as E,X as L,bA as T,bB as N,p as z,E as B,C as D,D as C,f as q,aQ as I}from"./ui-vendor-DEvE63cZ.js";import{r as n,R as M}from"./react-vendor-BGp5FbCG.js";import{u as b,c as k}from"./index-D3BnbEK0.js";import{m as w,A as F}from"./framer-vendor-DEiCTn3G.js";import{v as V}from"./vsc-dark-plus-CcVsXCy1.js";import"./utils-vendor-CJFcDo9C.js";const S=[{id:"big-o",title:"content.dsa.big-o.title",category:"Big O",difficulty:"Basic",description:"content.dsa.big-o.description",explanation:"content.dsa.big-o.explanation",codeExample:`
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
    `},{id:"arrays",title:"content.dsa.arrays.title",category:"Data Structures",difficulty:"Basic",description:"content.dsa.arrays.description",complexity:{time:"Access: O(1), Search: O(n)",space:"O(n)"},codeExample:`
const arr = [1, 2, 3, 4, 5];

// Access
console.log(arr[0]); // 1

// Insertion (push)
arr.push(6);

// Deletion (pop)
arr.pop();
    `},{id:"linked-list",title:"Linked Lists",category:"Data Structures",difficulty:"Basic",description:"A linear data structure where elements are not stored at contiguous memory locations.",complexity:{time:"Access: O(n), Insert/Del: O(1)",space:"O(n)"},codeExample:`
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
    `},{id:"stack",title:"Stack",category:"Data Structures",difficulty:"Basic",description:"LIFO (Last In First Out) data structure.",complexity:{time:"Push/Pop: O(1)",space:"O(n)"},codeExample:`
class Stack {
  constructor() {
    this.items = [];
  }
  push(element) { this.items.push(element); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}
    `},{id:"queue",title:"Queue",category:"Data Structures",difficulty:"Basic",description:"FIFO (First In First Out) data structure.",complexity:{time:"Enqueue: O(1), Dequeue: O(1) (amortized)",space:"O(n)"},codeExample:`
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) { this.items.push(element); }
  dequeue() { return this.items.shift(); } // O(n) in JS array, real Queue is O(1)
}
    `},{id:"hash-table",title:"Hash Tables",category:"Data Structures",difficulty:"Intermediate",description:"Implements an associative array abstract data type, a structure that can map keys to values.",complexity:{time:"Avg: O(1), Worst: O(n)",space:"O(n)"},codeExample:`
const map = new Map();

// Insert
map.set('key1', 'value1');

// Access
console.log(map.get('key1'));

// Check 
console.log(map.has('key1'));
    `},{id:"bst",title:"Binary Search Tree",category:"Data Structures",difficulty:"Intermediate",description:"A rooted binary tree data structure with the key of each internal node being greater than all the keys in the respective node's left subtree and less than the ones in its right subtree.",complexity:{time:"Avg: O(log n), Worst: O(n)",space:"O(n)"},codeExample:`
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
    `},{id:"graph",title:"Graphs",category:"Data Structures",difficulty:"Advanced",description:"A non-linear data structure consisting of nodes and edges.",complexity:{time:"Adjacency List: O(V+E)",space:"O(V+E)"},explanation:"Graphs can be directed or undirected, weighted or unweighted. They are used to model pairwise relations between objects (e.g., social networks, maps).",codeExample:`
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
    `},{id:"trie",title:"Trie (Prefix Tree)",category:"Data Structures",difficulty:"Advanced",description:"A tree-like data structure used to store a dynamic set or associative array where the keys are usually strings.",complexity:{time:"Insert/Search: O(L) where L is key length",space:"O(ALPHABET_SIZE * L * N)"},codeExample:`
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}
    `},{id:"bubble-sort",title:"Bubble Sort",category:"Algorithms",difficulty:"Basic",description:"Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",complexity:{time:"O(n^2)",space:"O(1)"},codeExample:`
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
    `},{id:"insertion-sort",title:"Insertion Sort",category:"Algorithms",difficulty:"Basic",description:"Builds the final sorted array one item at a time.",complexity:{time:"O(n^2)",space:"O(1)"},codeExample:`
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
    `},{id:"binary-search",title:"Binary Search",category:"Algorithms",difficulty:"Intermediate",description:"Search a sorted array by repeatedly dividing the search interval in half.",complexity:{time:"O(log n)",space:"O(1)"},codeExample:`
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
    `},{id:"merge-sort",title:"Merge Sort",category:"Algorithms",difficulty:"Intermediate",description:"Divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",complexity:{time:"O(n log n)",space:"O(n)"},codeExample:`
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
    `},{id:"quick-sort",title:"Quick Sort",category:"Algorithms",difficulty:"Intermediate",description:"Divide and conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.",complexity:{time:"Avg: O(n log n), Worst: O(n^2)",space:"O(log n)"},codeExample:`
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
    `},{id:"bfs",title:"BFS (Breadth First Search)",category:"Algorithms",difficulty:"Advanced",description:"An algorithm for traversing or searching tree or graph data structures.",complexity:{time:"O(V + E)",space:"O(V)"},codeExample:`
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
    `},{id:"dfs",title:"DFS (Depth First Search)",category:"Algorithms",difficulty:"Advanced",description:"An algorithm for traversing or searching tree or graph data structures.",complexity:{time:"O(V + E)",space:"O(V)"},codeExample:`
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start); // Process node

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}
    `},{id:"dp-fib",title:"DP: Fabonacci (Memoization)",category:"Algorithms",difficulty:"Advanced",description:"Dynamic Programming approach to calculate Fibonacci numbers.",complexity:{time:"O(n)",space:"O(n)"},codeExample:`
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
    `}],P=({topicId:t})=>{const a=["bubble-sort","insertion-sort","quick-sort","merge-sort","selection-sort"].includes(t),s=t==="arrays",o=t==="linked-list",x=t==="bst",c=t==="stack",p=t==="queue";return a?e.jsx(R,{algo:t}):s?e.jsx(W,{}):o?e.jsx(Q,{}):x?e.jsx(H,{}):c?e.jsx(G,{}):p?e.jsx(U,{}):null},R=({algo:t})=>{const{t:a}=b(),[s,o]=n.useState([]),[x,c]=n.useState(!1),[p,g]=n.useState([]),[i,f]=n.useState([]),y=()=>{const l=Array.from({length:15},()=>Math.floor(Math.random()*50)+10);o(l),c(!1),g([]),f([])};n.useEffect(()=>{y()},[]);const j=l=>new Promise(m=>setTimeout(m,l)),r=async()=>{c(!0);const l=[...s],m=l.length;for(let v=0;v<m;v++){for(let d=0;d<m-v-1;d++){if(!u.current)return;g([d,d+1]),await j(100),l[d]>l[d+1]&&([l[d],l[d+1]]=[l[d+1],l[d]],o([...l]),await j(100))}f(d=>[...d,m-v-1])}g([]),c(!1)},h=async()=>{u.current=!0,t==="bubble-sort"?await r():await r()},u=n.useRef(!0);return n.useEffect(()=>(u.current=!0,()=>{u.current=!1}),[]),e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h3",{className:"font-bold text-gray-800 dark:text-white",children:a("tutorial.visualizer")}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:y,disabled:x,className:"p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors",children:e.jsx(O,{size:18})}),e.jsxs("button",{onClick:h,disabled:x,className:"flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors",children:[x?e.jsx(A,{size:18}):e.jsx(E,{size:18}),a(x?"tutorial.running":"tutorial.start")]})]})]}),e.jsx("div",{className:"h-64 flex items-end justify-center gap-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4",children:s.map((l,m)=>e.jsx(w.div,{layout:!0,initial:{height:0},animate:{height:`${l/60*100}%`,backgroundColor:p.includes(m)?"#EF4444":i.includes(m)?"#10B981":"#3B82F6"},className:"w-4 md:w-6 rounded-t-md"},m))}),e.jsxs("div",{className:"mt-4 flex gap-4 text-xs text-gray-500 justify-center",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"w-3 h-3 bg-blue-500 rounded"})," ",a("tutorial.unsorted")]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"w-3 h-3 bg-red-500 rounded"})," ",a("tutorial.comparing")]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"w-3 h-3 bg-green-500 rounded"})," ",a("tutorial.sorted")]})]})]})},W=()=>{const{t}=b(),a=[10,20,30,40,50];return e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8",children:[e.jsx("h3",{className:"font-bold text-gray-800 dark:text-white mb-6",children:t("tutorial.arrayMemory")}),e.jsx("div",{className:"flex justify-center items-center gap-0",children:a.map((s,o)=>e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"w-16 h-16 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-500 transition-colors",children:s}),e.jsxs("div",{className:"absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400",children:["Idx: ",o]})]},o))})]})},Q=()=>{const{t}=b();return e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8",children:[e.jsx("h3",{className:"font-bold text-gray-800 dark:text-white mb-6",children:t("tutorial.linkedList")}),e.jsx("div",{className:"flex flex-wrap justify-center items-center gap-2",children:[10,20,30,40].map((a,s)=>e.jsxs(M.Fragment,{children:[e.jsxs("div",{className:"border border-gray-300 dark:border-gray-600 rounded-lg flex overflow-hidden",children:[e.jsx("div",{className:"w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold border-r border-gray-300 dark:border-gray-600",children:a}),e.jsx("div",{className:"w-8 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-xs text-gray-500",children:"Next"})]}),s<3&&e.jsx("div",{className:"text-gray-400",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M5 12h14m-7-7l7 7-7 7"})})}),s===3&&e.jsx("div",{className:"flex items-center text-gray-400 ml-2",children:e.jsx("div",{className:"text-sm font-mono",children:"NULL"})})]},s))})]})},G=()=>{const{t}=b();return e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8",children:[e.jsx("h3",{className:"font-bold text-gray-800 dark:text-white mb-6",children:t("tutorial.stack")}),e.jsx("div",{className:"flex justify-center",children:e.jsx("div",{className:"border-l-4 border-b-4 border-r-4 border-gray-300 dark:border-gray-600 p-4 w-32 flex flex-col-reverse gap-2 min-h-[200px] items-center bg-gray-50 dark:bg-gray-900/30",children:[40,30,20,10].map((a,s)=>e.jsx("div",{className:"w-full py-2 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-center rounded text-blue-800 dark:text-blue-200 font-bold",children:a},s))})})]})},U=()=>{const{t}=b();return e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8",children:[e.jsx("h3",{className:"font-bold text-gray-800 dark:text-white mb-6",children:t("tutorial.queue")}),e.jsxs("div",{className:"flex justify-center items-center gap-2 border-t-2 border-b-2 border-gray-300 dark:border-gray-600 p-4 min-h-[100px] relative",children:[e.jsx("div",{className:"absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 text-xs text-gray-500",children:"OUT (Dequeue)"}),[10,20,30,40].map((a,s)=>e.jsx("div",{className:"w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded font-bold",children:a},s)),e.jsx("div",{className:"absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 text-xs text-gray-500",children:"IN (Enqueue)"})]})]})},H=()=>{const{t}=b();return e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 flex flex-col items-center",children:[e.jsx("h3",{className:"font-bold text-gray-800 dark:text-white mb-6 w-full text-left",children:t("tutorial.bst")}),e.jsxs("div",{className:"relative w-64 h-48",children:[e.jsxs("svg",{className:"absolute inset-0 w-full h-full pointer-events-none stroke-gray-300 dark:stroke-gray-600",strokeWidth:"2",children:[e.jsx("line",{x1:"50%",y1:"20",x2:"25%",y2:"80"}),e.jsx("line",{x1:"50%",y1:"20",x2:"75%",y2:"80"}),e.jsx("line",{x1:"25%",y1:"80",x2:"12%",y2:"140"}),e.jsx("line",{x1:"25%",y1:"80",x2:"38%",y2:"140"})]}),e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md",children:"10"}),e.jsx("div",{className:"absolute top-[60px] left-[25%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md",children:"5"}),e.jsx("div",{className:"absolute top-[60px] left-[75%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md",children:"15"}),e.jsx("div",{className:"absolute top-[120px] left-[12%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md",children:"2"}),e.jsx("div",{className:"absolute top-[120px] left-[38%] -translate-x-1/2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md",children:"7"})]})]})},Y=()=>{const{t}=b(),[a,s]=n.useState(S[0].id),[o,x]=n.useState(""),[c,p]=n.useState(!0),g=n.useMemo(()=>S.map(r=>({...r,title:t(r.title),description:t(r.description),explanation:r.explanation?t(r.explanation):void 0})),[t]),i=n.useMemo(()=>g.find(r=>r.id===a)||g[0],[g,a]),f=n.useMemo(()=>g.filter(r=>r.title.toLowerCase().includes(o.toLowerCase())||r.description.toLowerCase().includes(o.toLowerCase())),[g,o]),y=n.useMemo(()=>{const r={};return f.forEach(h=>{r[h.category]||(r[h.category]=[]),r[h.category].push(h)}),r},[f]),j=r=>{switch(r){case"Basic":return"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";case"Intermediate":return"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";case"Advanced":return"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";default:return"bg-gray-100 text-gray-700"}};return e.jsxs("div",{className:"flex h-full bg-gray-50 dark:bg-gray-900 overflow-hidden relative",children:[e.jsx("button",{className:"md:hidden absolute top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md",onClick:()=>p(!c),children:c?e.jsx(L,{size:20}):e.jsx(T,{size:20})}),e.jsx(F,{mode:"wait",children:(c||window.innerWidth>=768)&&e.jsxs(w.div,{initial:{x:-300,opacity:0},animate:{x:0,opacity:1},exit:{x:-300,opacity:0},className:k("w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col absolute md:relative z-40 h-full shadow-xl md:shadow-none",!c&&"hidden md:flex"),children:[e.jsxs("div",{className:"p-6 border-b border-gray-100 dark:border-gray-700",children:[e.jsxs("h2",{className:"text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2",children:[e.jsx(N,{className:"text-blue-600",size:24}),t("tutorial.dsaTitle")]}),e.jsxs("div",{className:"mt-4 relative",children:[e.jsx(z,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",size:14}),e.jsx("input",{type:"text",placeholder:t("tutorial.searchTopics"),value:o,onChange:r=>x(r.target.value),className:"w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"})]})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-4 space-y-6",children:Object.entries(y).map(([r,h])=>e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2",children:r}),e.jsx("div",{className:"space-y-1",children:h.map(u=>e.jsxs("button",{onClick:()=>{s(u.id),window.innerWidth<768&&p(!1)},className:k("w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group",a===u.id?"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300":"text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"),children:[e.jsx("span",{children:u.title}),a===u.id&&e.jsx(B,{size:14})]},u.id))})]},r))})]})}),e.jsx("div",{className:"flex-1 overflow-y-auto w-full md:w-auto",children:e.jsx("div",{className:"max-w-4xl mx-auto p-8 pt-16 md:pt-8 min-h-full",children:e.jsxs(w.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.2},children:[e.jsxs("div",{className:"mb-2 flex items-center gap-2",children:[e.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",children:i.category}),e.jsx("span",{className:k("px-2.5 py-0.5 rounded-full text-xs font-medium",j(i.difficulty)),children:i.difficulty})]}),e.jsx("h1",{className:"text-4xl font-bold text-gray-900 dark:text-white mb-4",children:i.title}),e.jsx("p",{className:"text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8",children:i.description}),i.complexity&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-8",children:[e.jsxs("div",{className:"p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 text-orange-700 dark:text-orange-400 font-semibold",children:[e.jsx(D,{size:18}),t("tutorial.timeComplexity")]}),e.jsx("div",{className:"text-2xl font-mono text-gray-800 dark:text-white",children:i.complexity.time})]}),e.jsxs("div",{className:"p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400 font-semibold",children:[e.jsx(C,{size:18}),t("tutorial.spaceComplexity")]}),e.jsx("div",{className:"text-2xl font-mono text-gray-800 dark:text-white",children:i.complexity.space})]})]}),e.jsx("div",{className:"mb-8",children:e.jsx(P,{topicId:i.id})}),i.explanation&&e.jsxs("div",{className:"mb-8 max-w-none",children:[e.jsxs("h3",{className:"text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white",children:[e.jsx(N,{size:20,className:"text-gray-400"}),t("tutorial.explanation")]}),e.jsx("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200",children:i.explanation})]}),i.codeExample&&e.jsxs("div",{className:"mb-8",children:[e.jsxs("h3",{className:"text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white",children:[e.jsx(q,{size:20,className:"text-gray-400"}),t("tutorial.implementation")]}),e.jsxs("div",{className:"rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800",children:[e.jsx("div",{className:"bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center",children:e.jsx("span",{className:"text-xs font-mono text-gray-500",children:"JavaScript / TypeScript"})}),e.jsx(I,{language:"javascript",style:V,customStyle:{margin:0,padding:"1.5rem",fontSize:"0.9rem"},children:i.codeExample.trim()})]})]})]},i.id)})})]})};export{Y as DsaTutorial};
