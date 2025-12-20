export type ProgLanguage = 'android' | 'ios' | 'react' | 'vue' | 'javascript' | 'css' | 'html' | 'python';
export type ProgDifficulty = 'Basic' | 'Intermediate' | 'Advanced';

export interface ProgTopic {
    id: string;
    title: string;
    language: ProgLanguage;
    difficulty: ProgDifficulty;
    description: string;
    content: string; // Markdown supported
    codeExample?: string;
    visualizerId?: string; // To trigger specific infographic
}

export interface ProgLanguageMeta {
    id: ProgLanguage;
    name: string;
    icon: string; // Lucide icon name or image path
    color: string;
}

export const progLanguages: ProgLanguageMeta[] = [
    { id: 'android', name: 'Android (Kotlin/Compose)', icon: 'Smartphone', color: 'text-green-500' },
    { id: 'ios', name: 'iOS (Swift/SwiftUI)', icon: 'Apple', color: 'text-blue-500' },
    { id: 'react', name: 'React JS', icon: 'Atom', color: 'text-cyan-500' },
    { id: 'vue', name: 'Vue JS', icon: 'Box', color: 'text-emerald-500' },
    { id: 'javascript', name: 'JavaScript', icon: 'FileJson', color: 'text-yellow-500' },
    { id: 'css', name: 'CSS', icon: 'Palette', color: 'text-blue-400' },
    { id: 'html', name: 'HTML', icon: 'FileCode', color: 'text-orange-500' },
    { id: 'python', name: 'Python', icon: 'Terminal', color: 'text-blue-600' },
];

export const progTopics: ProgTopic[] = [
    // =========================================================================
    // ANDROID
    // =========================================================================
    {
        id: 'android-basic-kotlinsyntax',
        title: 'Kotlin Syntax Basics',
        language: 'android',
        difficulty: 'Basic',
        description: 'Variables, Functions, and Null Safety.',
        content: 'Kotlin is concise and null-safe by default. `val` is immutable, `var` is mutable.',
        codeExample: `
val name: String = "Android" // Immutable
var age: Int = 10           // Mutable
val nullable: String? = null // Nullable type
        `
    },
    {
        id: 'android-basic-activity',
        title: 'Activity Lifecycle',
        language: 'android',
        difficulty: 'Basic',
        description: 'Understanding how activities are created, started, paused, and destroyed.',
        content: 'The Activity class provides a core set of six callbacks: onCreate(), onStart(), onResume(), onPause(), onStop(), and onDestroy().',
        visualizerId: 'android-lifecycle',
        codeExample: `
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
}
        `
    },
    {
        id: 'android-basic-layouts-xml',
        title: 'Layouts (XML)',
        language: 'android',
        difficulty: 'Basic',
        description: 'Building UI with LinearConstraint and ConstraintLayout.',
        content: 'XML layouts define the structure of the UI. ConstraintLayout allows you to create large and complex layouts with a flat view hierarchy.',
        codeExample: `
<androidx.constraintlayout.widget.ConstraintLayout ...>
    <TextView
        android:id="@+id/text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!" />
</androidx.constraintlayout.widget.ConstraintLayout>
        `
    },
    {
        id: 'android-inter-compose-basic',
        title: 'Jetpack Compose Basics',
        language: 'android',
        difficulty: 'Intermediate',
        description: 'Declarative UI with Kotlin.',
        content: 'Compose is Android’s modern toolkit for building native UI.',
        codeExample: `
@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}
        `
    },
    {
        id: 'android-inter-state',
        title: 'State in Compose',
        language: 'android',
        difficulty: 'Intermediate',
        description: 'Managing state with remember and mutableStateOf.',
        content: 'State describes any value that can change over time. `remember` preserves state across recompositions.',
        codeExample: `
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}
        `
    },
    {
        id: 'android-inter-coroutines',
        title: 'Coroutines',
        language: 'android',
        difficulty: 'Intermediate',
        description: 'Asynchronous programming made easy.',
        content: 'A coroutine is a concurrency design pattern that you can use on Android to simplify code that executes asynchronously.',
        codeExample: `
lifecycleScope.launch {
    val result = fetchData() // Suspend function
    updateUI(result)
}
        `
    },
    {
        id: 'android-adv-hilt',
        title: 'Dependency Injection (Hilt)',
        language: 'android',
        difficulty: 'Advanced',
        description: 'Managing dependencies efficiently.',
        content: 'Hilt provides a standard way to incorporate Dagger dependency injection into an Android application.',
        codeExample: `
@HiltAndroidApp
class ExampleApp : Application()

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    @Inject lateinit var analytics: AnalyticsAdapter
}
        `
    },
    {
        id: 'android-adv-room',
        title: 'Room Database',
        language: 'android',
        difficulty: 'Advanced',
        description: 'Local data persistence.',
        content: 'The Room persistence library provides an abstraction layer over SQLite.',
        codeExample: `
@Entity
data class User(
    @PrimaryKey val uid: Int,
    @ColumnInfo(name = "first_name") val firstName: String?
)
        `
    },

    // =========================================================================
    // iOS (Swift)
    // =========================================================================
    {
        id: 'ios-basic-swift',
        title: 'Swift Fundamentals',
        language: 'ios',
        difficulty: 'Basic',
        description: 'Variables, Types, and Control Flow.',
        content: 'Swift provides its own versions of all fundamental C and Objective-C types, including Int, Double, Float, Bool, and String.',
        codeExample: `
let implicitInteger = 70
let implicitDouble = 70.0
let explicitDouble: Double = 70
        `
    },
    {
        id: 'ios-basic-optionals',
        title: 'Optionals',
        language: 'ios',
        difficulty: 'Basic',
        description: 'Handling missing values safely.',
        content: 'You use optionals in situations where a value may be absent.',
        codeExample: `
var serverResponseCode: Int? = 404
serverResponseCode = nil
        `
    },
    {
        id: 'ios-inter-swiftui-views',
        title: 'SwiftUI Views & Modifiers',
        language: 'ios',
        difficulty: 'Intermediate',
        description: 'Building declarative UIs.',
        content: 'SwiftUI uses a declarative syntax so you can simply state what your user interface should do.',
        codeExample: `
VStack {
    Image(systemName: "globe")
        .imageScale(.large)
        .foregroundColor(.accentColor)
    Text("Hello, world!")
}
        `
    },
    {
        id: 'ios-inter-state',
        title: 'State & Binding',
        language: 'ios',
        difficulty: 'Intermediate',
        description: 'Managing data flow in SwiftUI.',
        content: '`@State` is a property wrapper type that can read and write a value managed by SwiftUI.',
        codeExample: `
struct ContentView: View {
    @State private var isPlaying: Bool = false
    var body: some View {
        Button(isPlaying ? "Pause" : "Play") {
            isPlaying.toggle()
        }
    }
}
        `
    },
    {
        id: 'ios-adv-combine',
        title: 'Combine Framework',
        language: 'ios',
        difficulty: 'Advanced',
        description: 'Processing values over time.',
        content: 'Customize handling of asynchronous events by combining event-processing operators.',
        codeExample: `
let publisher = [1, 2, 3].publisher
publisher
    .map { $0 * 10 }
    .sink(receiveValue: { print($0) })
        `
    },
    {
        id: 'ios-adv-coredata',
        title: 'Core Data',
        language: 'ios',
        difficulty: 'Advanced',
        description: 'Persisting data locally.',
        content: 'Use Core Data to save your application’s permanent data for offline use, to cache temporary data, and to add undo functionality.',
        codeExample: `
@FetchRequest(
    sortDescriptors: [NSSortDescriptor(keyPath: \Item.timestamp, ascending: true)],
    animation: .default)
private var items: FetchedResults<Item>
        `
    },

    // =========================================================================
    // REACT JS
    // =========================================================================
    {
        id: 'react-basic-components',
        title: 'Components & Props',
        language: 'react',
        difficulty: 'Basic',
        description: 'The core building blocks.',
        content: 'Components let you split the UI into independent, reusable pieces.',
        codeExample: `
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
        `
    },
    {
        id: 'react-basic-jsx',
        title: 'JSX Syntax',
        language: 'react',
        difficulty: 'Basic',
        description: 'Writing HTML inside JavaScript.',
        content: 'JSX is a syntax extension for JavaScript. It is recommended to use it with React to describe what the UI should look like.',
        codeExample: `
const element = <h1>Hello, world!</h1>;
        `
    },
    {
        id: 'react-inter-hooks-state',
        title: 'useState Hook',
        language: 'react',
        difficulty: 'Intermediate',
        description: 'Managing local component state.',
        content: '`useState` is a Hook that lets you add React state to function components.',
        visualizerId: 'react-hooks',
        codeExample: `
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>
        `
    },
    {
        id: 'react-inter-hooks-effect',
        title: 'useEffect Hook',
        language: 'react',
        difficulty: 'Intermediate',
        description: 'Performing side effects.',
        content: 'Data fetching, subscription, or manually changing the DOM are all examples of side effects.',
        codeExample: `
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]); // Only re-run if count changes
        `
    },
    {
        id: 'react-adv-context',
        title: 'Context API',
        language: 'react',
        difficulty: 'Advanced',
        description: 'Passing data deeply without props drilling.',
        content: 'Context provides a way to pass data through the component tree without having to pass props down manually at every level.',
        codeExample: `
const ThemeContext = React.createContext('light');
// Provider
<ThemeContext.Provider value="dark">
  <Toolbar />
</ThemeContext.Provider>
// Consumer (useContext)
const theme = useContext(ThemeContext);
        `
    },
    {
        id: 'react-adv-redux',
        title: 'Redux Toolkit',
        language: 'react',
        difficulty: 'Advanced',
        description: 'Global state management.',
        content: 'Redux is a predictable state container for JS apps.',
        codeExample: `
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 }
  }
})
        `
    },

    // =========================================================================
    // VUE JS
    // =========================================================================
    {
        id: 'vue-basic-template',
        title: 'Template Syntax',
        language: 'vue',
        difficulty: 'Basic',
        description: 'Binding data to the DOM.',
        content: 'Vue.js uses an HTML-based template syntax.',
        codeExample: `
<span>Message: {{ msg }}</span>
        `
    },
    {
        id: 'vue-basic-directives',
        title: 'Directives (v-if, v-for)',
        language: 'vue',
        difficulty: 'Basic',
        description: 'Special attributes with the v- prefix.',
        content: 'Directives apply special reactive behavior to the rendered DOM.',
        codeExample: `
<p v-if="seen">Now you see me</p>
<li v-for="item in items">
  {{ item.message }}
</li>
        `
    },
    {
        id: 'vue-inter-composition',
        title: 'Composition API',
        language: 'vue',
        difficulty: 'Intermediate',
        description: 'Using setup() and refs.',
        content: 'Composition API is a set of APIs that allows us to author Vue components using imported functions instead of declaring options.',
        codeExample: `
import { ref, onMounted } from 'vue'

setup() {
  const count = ref(0)
  function increment() { count.value++ }
  return { count, increment }
}
        `
    },
    {
        id: 'vue-inter-computed',
        title: 'Computed Properties',
        language: 'vue',
        difficulty: 'Intermediate',
        description: 'Reactive derived state.',
        content: 'For complex logic that includes reactive data, you should use a computed property.',
        codeExample: `
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
        `
    },
    {
        id: 'vue-adv-pinia',
        title: 'State Management (Pinia)',
        language: 'vue',
        difficulty: 'Advanced',
        description: 'The intuitive store for Vue.js.',
        content: 'Pinia is a store library for Vue, it allows you to share a state across components/pages.',
        codeExample: `
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ }
  }
})
        `
    },

    // =========================================================================
    // CSS
    // =========================================================================
    {
        id: 'css-basic-selectors',
        title: 'Selectors & Specificity',
        language: 'css',
        difficulty: 'Basic',
        description: 'Targeting elements to style.',
        content: 'CSS selectors define the pattern to select elements to which a set of CSS rules are then applied.',
        codeExample: `
/* Element selector */
p { color: red; }

/* Class selector */
.my-class { font-size: 20px; }

/* ID selector */
#my-id { background: blue; }
        `
    },
    {
        id: 'css-basic-boxmodel',
        title: 'The Box Model',
        language: 'css',
        difficulty: 'Basic',
        description: 'Margins, Borders, and Padding.',
        content: 'All HTML elements can be considered as boxes.',
        visualizerId: 'css-box-model',
        codeExample: `
div {
  width: 300px;
  border: 1px solid black;
  padding: 20px;
  margin: 10px;
}
        `
    },
    {
        id: 'css-inter-flexbox',
        title: 'Flexbox',
        language: 'css',
        difficulty: 'Intermediate',
        description: '1D layout model.',
        content: 'The Flexible Box Layout Module makes it easier to design flexible responsive layout structures.',
        visualizerId: 'css-flexbox',
        codeExample: `
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
        `
    },
    {
        id: 'css-inter-grid',
        title: 'CSS Grid',
        language: 'css',
        difficulty: 'Intermediate',
        description: '2D layout system.',
        content: 'CSS Grid Layout excels at dividing a page into major regions or defining the relationship in terms of size, position, and layer.',
        codeExample: `
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
        `
    },
    {
        id: 'css-adv-animations',
        title: 'Animations & Transitions',
        language: 'css',
        difficulty: 'Advanced',
        description: 'Bringing movement to the web.',
        content: 'CSS animations make it possible to animate transitions from one CSS style configuration to another.',
        codeExample: `
@keyframes slidein {
  from { transform: translateX(0%); }
  to { transform: translateX(100%); }
}

div {
  animation: slidein 3s infinite;
}
        `
    },

    // =========================================================================
    // JAVASCRIPT
    // =========================================================================
    {
        id: 'js-basic-vars',
        title: 'Variables & Types',
        language: 'javascript',
        difficulty: 'Basic',
        description: 'let, const, and var.',
        content: 'Always use `const` or `let`. Avoid `var` to prevent scope issues.',
        codeExample: `
let x = 10;
const y = 20;
// y = 30; // Error!
        `
    },
    {
        id: 'js-basic-functions',
        title: 'Functions & Arrow Functions',
        language: 'javascript',
        difficulty: 'Basic',
        description: 'Writing reusable blocks of code.',
        content: 'Arrow functions provide a shorter syntax.',
        codeExample: `
function add(a, b) {
  return a + b;
}

const multiply = (a, b) => a * b;
        `
    },
    {
        id: 'js-inter-async',
        title: 'Async/Await & Promises',
        language: 'javascript',
        difficulty: 'Intermediate',
        description: 'Handling asynchronous operations.',
        content: '`async` and `await` make promises easier to write.',
        codeExample: `
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
        `
    },
    {
        id: 'js-inter-dom',
        title: 'DOM Manipulation',
        language: 'javascript',
        difficulty: 'Intermediate',
        description: 'Interacting with the webpage.',
        content: 'The DOM (Document Object Model) is an interface for changing the content of a document.',
        codeExample: `
const btn = document.getElementById('myBtn');
btn.addEventListener('click', () => {
  btn.style.backgroundColor = 'blue';
});
        `
    },
    {
        id: 'js-adv-closures',
        title: 'Closures',
        language: 'javascript',
        difficulty: 'Advanced',
        description: 'Function scope and lexical environments.',
        content: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).',
        codeExample: `
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
console.log(add5(2)); // 7
        `
    },
    {
        id: 'js-adv-event-loop',
        title: 'The Event Loop',
        language: 'javascript',
        difficulty: 'Advanced',
        description: 'How JS handles concurrency.',
        content: 'JavaScript has a runtime model based on an event loop, which is responsible for executing the code, collecting and processing events, and executing queued sub-tasks.',
        codeExample: `
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Output: 1, 4, 3, 2
        `
    },

    // =========================================================================
    // HTML
    // =========================================================================
    {
        id: 'html-basic-semantic',
        title: 'Semantic HTML',
        language: 'html',
        difficulty: 'Basic',
        description: 'Using the right tag for the job.',
        content: 'Semantic elements clearly describe their meaning to both the browser and the developer (e.g., <header>, <article>, <footer>).',
        codeExample: `
<main>
  <article>
    <header><h1>Title</h1></header>
    <p>Content...</p>
  </article>
</main>
        `
    },
    {
        id: 'html-inter-forms',
        title: 'Forms & Inputs',
        language: 'html',
        difficulty: 'Intermediate',
        description: 'Collecting user data.',
        content: 'HTML forms are used to collect user input.',
        codeExample: `
<form action="/submit">
  <label for="fname">First name:</label>
  <input type="text" id="fname" name="fname">
  <input type="submit" value="Submit">
</form>
        `
    },
    {
        id: 'html-adv-canvas',
        title: 'Canvas API',
        language: 'html',
        difficulty: 'Advanced',
        description: 'Drawing graphics on the fly.',
        content: 'The HTML <canvas> element is used to draw graphics, on the fly, via JavaScript.',
        codeExample: `
<canvas id="myCanvas"></canvas>
<script>
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
</script>
        `
    },

    // =========================================================================
    // PYTHON
    // =========================================================================
    {
        id: 'python-basic-syntax',
        title: 'Syntax & Indentation',
        language: 'python',
        difficulty: 'Basic',
        description: 'Writing clean Python code.',
        content: 'Python uses indentation to indicate a block of code.',
        codeExample: `
if 5 > 2:
  print("Five is greater than two!")
        `
    },
    {
        id: 'python-basic-lists',
        title: 'Lists & Dictionaries',
        language: 'python',
        difficulty: 'Basic',
        description: 'Core data structures.',
        content: 'Lists are ordered and mutable. Dictionaries are key-value pairs.',
        codeExample: `
mylist = ["apple", "banana"]
mydict = {"brand": "Ford", "year": 1964}
        `
    },
    {
        id: 'python-inter-functions',
        title: 'Functions & Modules',
        language: 'python',
        difficulty: 'Intermediate',
        description: 'Reusability and organization.',
        content: 'A function is a block of code which only runs when it is called.',
        codeExample: `
def my_function(fname):
  print("Hello " + fname)

import math
print(math.pi)
        `
    },
    {
        id: 'python-inter-classes',
        title: 'Classes & Objects',
        language: 'python',
        difficulty: 'Intermediate',
        description: 'Object-Oriented Programming (OOP).',
        content: 'Python is an object oriented programming language.',
        codeExample: `
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

p1 = Person("John", 36)
print(p1.name)
        `
    },
    {
        id: 'python-adv-decorators',
        title: 'Decorators',
        language: 'python',
        difficulty: 'Advanced',
        description: 'Modifying function behavior.',
        content: 'Decorators are a very powerful and useful tool in Python since it allows programmers to modify the behaviour of a function or class.',
        codeExample: `
def my_decorator(func):
    def wrapper():
        print("Before")
        func()
        print("After")
    return wrapper

@my_decorator
def say_whee():
    print("Whee!")
        `
    },
    {
        id: 'python-adv-generators',
        title: 'Generators',
        language: 'python',
        difficulty: 'Advanced',
        description: 'Iterators using yield.',
        content: 'Generators are a simple and powerful tool for creating iterators.',
        codeExample: `
def reverse(data):
    for index in range(len(data)-1, -1, -1):
        yield data[index]

for char in reverse('golf'):
    print(char)
        `
    },
    // =========================================================================
    // ANDROID (ADDITIONS)
    // =========================================================================
    {
        id: 'android-inter-navigation',
        title: 'Navigation Component',
        language: 'android',
        difficulty: 'Intermediate',
        description: 'Moving between screens.',
        content: 'The Navigation component consists of three key parts: Navigation Graph, NavHost, and NavController.',
        codeExample: `
navController.navigate(R.id.action_home_to_details)
        `
    },
    {
        id: 'android-inter-retrofit',
        title: 'Networking (Retrofit)',
        language: 'android',
        difficulty: 'Intermediate',
        description: 'Type-safe HTTP client.',
        content: 'Retrofit turns your HTTP API into a Java interface.',
        codeExample: `
interface ApiService {
    @GET("users/{user}/repos")
    suspend fun listRepos(@Path("user") user: String): List<Repo>
}
        `
    },
    {
        id: 'android-adv-workmanager',
        title: 'WorkManager',
        language: 'android',
        difficulty: 'Advanced',
        description: 'Background processing.',
        content: 'WorkManager is the recommended solution for persistent work that needs to be guaranteed to execute.',
        codeExample: `
val uploadWorkRequest = OneTimeWorkRequestBuilder<UploadWorker>()
        .build()
WorkManager.getInstance(context).enqueue(uploadWorkRequest)
        `
    },

    // =========================================================================
    // iOS (ADDITIONS)
    // =========================================================================
    {
        id: 'ios-inter-uikit-interop',
        title: 'UIKit Interoperability',
        language: 'ios',
        difficulty: 'Intermediate',
        description: 'Using UIKit in SwiftUI.',
        content: 'UIViewRepresentable allows you to wrap a UIKit view and use it within your SwiftUI View hierarchy.',
        codeExample: `
struct MyView: UIViewRepresentable {
    func makeUIView(context: Context) -> UILabel {
        return UILabel()
    }
}
        `
    },
    {
        id: 'ios-adv-testing',
        title: 'Unit Testing',
        language: 'ios',
        difficulty: 'Advanced',
        description: 'Ensuring code quality.',
        content: 'XCTest is the framework for writing unit tests in Swift.',
        codeExample: `
func testExample() throws {
    let value = 2 + 2
    XCTAssertEqual(value, 4)
}
        `
    },

    // =========================================================================
    // REACT (ADDITIONS)
    // =========================================================================
    {
        id: 'react-inter-router',
        title: 'React Router',
        language: 'react',
        difficulty: 'Intermediate',
        description: 'Client-side routing.',
        content: 'React Router enables "client side routing".',
        codeExample: `
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
        `
    },
    {
        id: 'react-adv-performance',
        title: 'Performance Optimization',
        language: 'react',
        difficulty: 'Advanced',
        description: 'useMemo and useCallback.',
        content: 'Memorization helpers to prevent unnecessary re-renders.',
        codeExample: `
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
        `
    },

    // =========================================================================
    // VUE (ADDITIONS)
    // =========================================================================
    {
        id: 'vue-inter-router',
        title: 'Vue Router',
        language: 'vue',
        difficulty: 'Intermediate',
        description: 'Official router for Vue.js.',
        content: 'Vue Router seamlessly integrates with Vue.js core to make building Single Page Applications a breeze.',
        codeExample: `
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]
        `
    },
    {
        id: 'vue-adv-slots',
        title: 'Slots',
        language: 'vue',
        difficulty: 'Advanced',
        description: 'Content distribution API.',
        content: 'Slots allows you to inject content into a component from a parent.',
        codeExample: `
<!-- Child -->
<div class="container">
  <slot></slot>
</div>

<!-- Parent -->
<Child>Hello via Slot</Child>
        `
    },

    // =========================================================================
    // JAVASCRIPT (ADDITIONS)
    // =========================================================================
    {
        id: 'js-basic-es6',
        title: 'ES6+ Features',
        language: 'javascript',
        difficulty: 'Basic',
        description: 'Modern JavaScript syntax.',
        content: 'Destructuring, Spread/Rest operators, Template Literals.',
        codeExample: `
const { name, age } = person;
const numbers = [1, ...others];
const str = \`My name is \${name}\`;
        `
    },
    {
        id: 'js-adv-modules',
        title: 'Modules (Import/Export)',
        language: 'javascript',
        difficulty: 'Advanced',
        description: 'Organizing code.',
        content: 'JavaScript modules allow you to break up your code into separate files.',
        codeExample: `
// math.js
export const add = (a, b) => a + b;

// main.js
import { add } from './math.js';
        `
    },

    // =========================================================================
    // PYTHON (ADDITIONS)
    // =========================================================================
    {
        id: 'python-inter-file',
        title: 'File Handling',
        language: 'python',
        difficulty: 'Intermediate',
        description: 'Reading and writing files.',
        content: 'Python has several functions for creating, reading, updating, and deleting files.',
        codeExample: `
f = open("demofile.txt", "r")
print(f.read())
f.close()
        `
    },
    {
        id: 'python-adv-exceptions',
        title: 'Exception Handling',
        language: 'python',
        difficulty: 'Advanced',
        description: 'Try, Except, Finally.',
        content: 'When an error occurs, Python will stop and generate an error message. These exceptions can be handled using the try statement.',
        codeExample: `
try:
  print(x)
except NameError:
  print("Variable x is not defined")
finally:
  print("The 'try except' is finished")
        `
    },
    // =========================================================================
    // ANDROID (ROUND 3)
    // =========================================================================
    {
        id: 'android-inter-datastore',
        title: 'DataStore',
        language: 'android',
        difficulty: 'Intermediate',
        description: 'Modern data persistence.',
        content: 'Jetpack DataStore is a data storage solution that allows you to store key-value pairs or typed objects with protocol buffers.',
        codeExample: `
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")
        `
    },
    {
        id: 'android-adv-notifications',
        title: 'Notifications',
        language: 'android',
        difficulty: 'Advanced',
        description: 'User engagement.',
        content: 'A notification is a message that Android displays outside your app\'s UI to provide the user with reminders, communication from other people, or other timely information.',
        codeExample: `
val builder = NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(R.drawable.notification_icon)
        .setContentTitle("My notification")
        .setContentText("Hello World!")
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        `
    },

    // =========================================================================
    // iOS (ROUND 3)
    // =========================================================================
    {
        id: 'ios-inter-autolayout',
        title: 'Auto Layout',
        language: 'ios',
        difficulty: 'Intermediate',
        description: 'Responsive UIs.',
        content: 'Auto Layout dynamically calculates the size and position of all the views in your view hierarchy, based on constraints on those views.',
        codeExample: `
NSLayoutConstraint.activate([
    view.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    view.centerYAnchor.constraint(equalTo: view.centerYAnchor)
])
        `
    },
    {
        id: 'ios-adv-gcd',
        title: 'Grand Central Dispatch (GCD)',
        language: 'ios',
        difficulty: 'Advanced',
        description: 'Low-level concurrency.',
        content: 'GCD provides and manages FIFO queues to which your application can submit tasks.',
        codeExample: `
DispatchQueue.global(qos: .background).async {
    // Background work
    DispatchQueue.main.async {
        // Update UI
    }
}
        `
    },

    // =========================================================================
    // REACT (ROUND 3)
    // =========================================================================
    {
        id: 'react-inter-customhooks',
        title: 'Custom Hooks',
        language: 'react',
        difficulty: 'Intermediate',
        description: 'Reusing stateful logic.',
        content: 'Building your own Hooks lets you extract component logic into reusable functions.',
        codeExample: `
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  // ... subscription logic
  return isOnline;
}
        `
    },
    {
        id: 'react-adv-errorboundaries',
        title: 'Error Boundaries',
        language: 'react',
        difficulty: 'Advanced',
        description: 'Handling errors gracefully.',
        content: 'Error boundaries are React components that catch JavaScript errors anywhere in their child component tree.',
        codeExample: `
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToMyService(error, errorInfo);
  }
  // ...
}
        `
    },

    // =========================================================================
    // VUE (ROUND 3)
    // =========================================================================
    {
        id: 'vue-inter-watchers',
        title: 'Watchers',
        language: 'vue',
        difficulty: 'Intermediate',
        description: 'Reacting to data changes.',
        content: 'Computed properties allow us to declaratively compute derived values. However, there are cases where we need to perform "side effects" in reaction to state changes.',
        codeExample: `
watch(question, async (newQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
  }
})
        `
    },
    {
        id: 'vue-adv-teleport',
        title: 'Teleport',
        language: 'vue',
        difficulty: 'Advanced',
        description: 'Rendering outside the DOM hierarchy.',
        content: 'Teleport is a built-in component that allows us to "teleport" a part of a component\'s template into a DOM node that exists outside the DOM hierarchy of that component.',
        codeExample: `
<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
        `
    },

    // =========================================================================
    // JAVASCRIPT (ROUND 3)
    // =========================================================================
    {
        id: 'js-inter-storage',
        title: 'Web Storage API',
        language: 'javascript',
        difficulty: 'Intermediate',
        description: 'localStorage & sessionStorage.',
        content: 'The Web Storage API provides mechanisms by which browsers can store key/value pairs, in a much more intuitive fashion than using cookies.',
        codeExample: `
localStorage.setItem('myCat', 'Tom');
const cat = localStorage.getItem('myCat');
localStorage.removeItem('myCat');
        `
    },
    {
        id: 'js-adv-fetch',
        title: 'Fetch API Deep Dive',
        language: 'javascript',
        difficulty: 'Advanced',
        description: 'Advanced networking.',
        content: 'The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline, such as requests and responses.',
        codeExample: `
fetch('https://example.com/profile', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
        `
    },

    // =========================================================================
    // CSS (ROUND 3)
    // =========================================================================
    {
        id: 'css-inter-mediaqueries',
        title: 'Media Queries',
        language: 'css',
        difficulty: 'Intermediate',
        description: 'Responsive Design.',
        content: 'Media queries are useful when you want to modify your site or app depending on a device\'s general type (such as print vs. screen) or specific characteristics and parameters (such as screen resolution or browser viewport width).',
        codeExample: `
@media (max-width: 600px) {
  .sidebar {
    display: none;
  }
}
        `
    },
    {
        id: 'css-adv-variables',
        title: 'CSS Variables',
        language: 'css',
        difficulty: 'Advanced',
        description: 'Custom properties.',
        content: 'Custom properties (sometimes referred to as CSS variables or cascading variables) are entities defined by CSS authors that contain specific values to be reused throughout a document.',
        codeExample: `
:root {
  --main-bg-color: brown;
}

element {
  background-color: var(--main-bg-color);
}
        `
    },

    // =========================================================================
    // HTML (ROUND 3)
    // =========================================================================
    {
        id: 'html-inter-media',
        title: 'Audio & Video',
        language: 'html',
        difficulty: 'Intermediate',
        description: 'Embedded media.',
        content: 'The HTML <audio> and <video> elements are used to embed sound and video content in documents.',
        codeExample: `
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
        `
    },
    {
        id: 'html-adv-meta',
        title: 'Meta Tags & SEO',
        language: 'html',
        difficulty: 'Advanced',
        description: 'Information for search engines.',
        content: 'The <meta> tag defines metadata about an HTML document. Metadata is data (information) about data.',
        codeExample: `
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Free Web tutorials">
  <meta name="keywords" content="HTML, CSS, JavaScript">
  <meta name="author" content="John Doe">
</head>
        `
    },

    // =========================================================================
    // PYTHON (ROUND 3)
    // =========================================================================
    {
        id: 'python-inter-lambda',
        title: 'Lambda Functions',
        language: 'python',
        difficulty: 'Intermediate',
        description: 'Anonymous functions.',
        content: 'A lambda function is a small anonymous function. A lambda function can take any number of arguments, but can only have one expression.',
        codeExample: `
x = lambda a, b : a * b
print(x(5, 6))
        `
    },
    {
        id: 'python-adv-context',
        title: 'Context Managers',
        language: 'python',
        difficulty: 'Advanced',
        description: 'The "with" statement.',
        content: 'Context managers allow you to allocate and release resources precisely when you want to.',
        codeExample: `
with open('file.txt', 'w') as f:
    f.write('hello world!')
# File is automatically closed here
        `
    }
];
