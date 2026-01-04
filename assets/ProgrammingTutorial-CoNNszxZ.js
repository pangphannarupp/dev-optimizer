import{j as e,X as C,bA as I,A as T,p as N,E as B,bv as h,bB as M,f as w,aQ as L,T as R,b as P,P as U,af as D,bC as F,G as _,d as V}from"./ui-vendor-DEvE63cZ.js";import{r,R as y}from"./react-vendor-BGp5FbCG.js";import{u as z,c as f}from"./index-D3BnbEK0.js";import{m as x,A as O}from"./framer-vendor-DEiCTn3G.js";import{v as H}from"./vsc-dark-plus-CcVsXCy1.js";import"./utils-vendor-CJFcDo9C.js";const E=[{id:"android",name:"Android (Kotlin/Compose)",icon:"Smartphone",color:"text-green-500"},{id:"ios",name:"iOS (Swift/SwiftUI)",icon:"Apple",color:"text-blue-500"},{id:"react",name:"React JS",icon:"Atom",color:"text-cyan-500"},{id:"vue",name:"Vue JS",icon:"Box",color:"text-emerald-500"},{id:"javascript",name:"JavaScript",icon:"FileJson",color:"text-yellow-500"},{id:"css",name:"CSS",icon:"Palette",color:"text-blue-400"},{id:"html",name:"HTML",icon:"FileCode",color:"text-orange-500"},{id:"python",name:"Python",icon:"Terminal",color:"text-blue-600"}],G=[{id:"android-basic-intro",title:"content.prog.android-basic-intro.title",language:"android",difficulty:"Basic",description:"content.prog.android-basic-intro.description",content:"content.prog.android-basic-intro.content",codeExample:`
fun main() {
    println("Hello, Android Developer!")
}
        `},{id:"android-basic-kotlinsyntax",title:"content.prog.android-basic-kotlinsyntax.title",language:"android",difficulty:"Basic",description:"content.prog.android-basic-kotlinsyntax.description",content:"content.prog.android-basic-kotlinsyntax.content",codeExample:`
val name: String = "Android" // Immutable
var age: Int = 10           // Mutable
val nullable: String? = null // Nullable type
        `},{id:"android-basic-control-flow",title:"content.prog.android-basic-control-flow.title",language:"android",difficulty:"Basic",description:"content.prog.android-basic-control-flow.description",content:"content.prog.android-basic-control-flow.content",codeExample:`
val max = if (a > b) a else b

when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
        `},{id:"android-basic-collections",title:"content.prog.android-basic-collections.title",language:"android",difficulty:"Basic",description:"content.prog.android-basic-collections.description",content:"content.prog.android-basic-collections.content",codeExample:`
val numbers = listOf(1, 2, 3) // Immutable
val mutableNumbers = mutableListOf(1, 2, 3) // Mutable
mutableNumbers.add(4)
        `},{id:"android-basic-compose-ui",title:"content.prog.android-basic-compose-ui.title",language:"android",difficulty:"Basic",description:"content.prog.android-basic-compose-ui.description",content:"content.prog.android-basic-compose-ui.content",codeExample:`
Column {
    Text(text = "Hello")
    Row {
        Text(text = "World")
        Button(onClick = { }) { Text("Click") }
    }
}
        `},{id:"android-basic-activity",title:"content.prog.android-basic-activity.title",language:"android",difficulty:"Basic",description:"content.prog.android-basic-activity.description",content:"content.prog.android-basic-activity.content",visualizerId:"android-lifecycle",codeExample:`
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
}
        `},{id:"android-basic-layouts-xml",title:"content.prog.android-basic-layouts-xml.title",language:"android",difficulty:"Basic",description:"content.prog.android-basic-layouts-xml.description",content:"content.prog.android-basic-layouts-xml.content",codeExample:`
<androidx.constraintlayout.widget.ConstraintLayout ...>
    <TextView
        android:id="@+id/text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!" />
</androidx.constraintlayout.widget.ConstraintLayout>
        `},{id:"android-xml-linear",title:"content.prog.android-xml-linear.title",language:"android",difficulty:"Basic",description:"content.prog.android-xml-linear.description",content:"content.prog.android-xml-linear.content",codeExample:`
<LinearLayout
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView android:text="Row 1" />
    <TextView android:text="Row 2" />
</LinearLayout>
        `},{id:"android-xml-relative",title:"content.prog.android-xml-relative.title",language:"android",difficulty:"Basic",description:"content.prog.android-xml-relative.description",content:"content.prog.android-xml-relative.content",codeExample:`
<RelativeLayout ...>
    <Button
        android:id="@+id/btn1"
        android:layout_centerInParent="true"
        android:text="Center" />
</RelativeLayout>
        `},{id:"android-xml-frame",title:"content.prog.android-xml-frame.title",language:"android",difficulty:"Basic",description:"content.prog.android-xml-frame.description",content:"content.prog.android-xml-frame.content",codeExample:`
<FrameLayout ...>
    <ImageView android:src="@drawable/bg" ... />
    <TextView android:text="Overlay Text" ... />
</FrameLayout>
        `},{id:"android-xml-scroll",title:"content.prog.android-xml-scroll.title",language:"android",difficulty:"Basic",description:"content.prog.android-xml-scroll.description",content:"content.prog.android-xml-scroll.content",codeExample:`
<ScrollView ...>
    <LinearLayout android:orientation="vertical" ...>
        <!-- Many views here -->
    </LinearLayout>
</ScrollView>
        `},{id:"android-inter-compose-basic",title:"content.prog.android-inter-compose-basic.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-compose-basic.description",content:"content.prog.android-inter-compose-basic.content",codeExample:`
@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}
        `},{id:"android-compose-layouts-standard",title:"content.prog.android-compose-layouts-standard.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-compose-layouts-standard.description",content:"content.prog.android-compose-layouts-standard.content",codeExample:`
Column(
    modifier = Modifier.fillMaxSize(),
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.CenterHorizontally
) {
    Box(Modifier.size(100.dp).background(Color.Blue))
}
        `},{id:"android-compose-scaffold",title:"content.prog.android-compose-scaffold.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-compose-scaffold.description",content:"content.prog.android-compose-scaffold.content",codeExample:`
Scaffold(
    topBar = { TopAppBar(title = { Text("My App") }) },
    floatingActionButton = { FloatingActionButton(onClick = {}) { Icon(...) } }
) { contentPadding ->
    // Screen content
}
        `},{id:"android-compose-constraint",title:"content.prog.android-compose-constraint.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-compose-constraint.description",content:"content.prog.android-compose-constraint.content",codeExample:`
ConstraintLayout {
    val (button, text) = createRefs()
    Button(
        onClick = {},
        modifier = Modifier.constrainAs(button) {
            top.linkTo(parent.top, margin = 16.dp)
        }
    ) { Text("Button") }
}
        `},{id:"android-compose-surface",title:"content.prog.android-compose-surface.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-compose-surface.description",content:"content.prog.android-compose-surface.content",codeExample:`
Surface(
    modifier = Modifier.padding(8.dp),
    shape = RoundedCornerShape(8.dp),
    color = MaterialTheme.colorScheme.surface,
    shadowElevation = 4.dp
) {
    Text("Content on surface")
}
        `},{id:"android-inter-state",title:"content.prog.android-inter-state.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-state.description",content:"content.prog.android-inter-state.content",codeExample:`
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}
        `},{id:"android-inter-coroutines",title:"content.prog.android-inter-coroutines.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-coroutines.description",content:"content.prog.android-inter-coroutines.content",codeExample:`
lifecycleScope.launch {
    val result = fetchData() // Suspend function
    updateUI(result)
}
        `},{id:"android-adv-hilt",title:"content.prog.android-adv-hilt.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-hilt.description",content:"content.prog.android-adv-hilt.content",codeExample:`
@HiltAndroidApp
class ExampleApp : Application()

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    @Inject lateinit var analytics: AnalyticsAdapter
}
        `},{id:"android-adv-room",title:"content.prog.android-adv-room.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-room.description",content:"content.prog.android-adv-room.content",codeExample:`
@Entity
data class User(
    @PrimaryKey val uid: Int,
    @ColumnInfo(name = "first_name") val firstName: String?
)
        `},{id:"ios-basic-intro",title:"content.prog.ios-basic-intro.title",language:"ios",difficulty:"Basic",description:"content.prog.ios-basic-intro.description",content:"content.prog.ios-basic-intro.content",codeExample:`
import SwiftUI

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            Text("Hello, iOS!")
        }
    }
}
        `},{id:"ios-basic-swift",title:"content.prog.ios-basic-swift.title",language:"ios",difficulty:"Basic",description:"content.prog.ios-basic-swift.description",content:"content.prog.ios-basic-swift.content",codeExample:`
let implicitInteger = 70
let implicitDouble = 70.0
let explicitDouble: Double = 70
        `},{id:"ios-basic-optionals",title:"content.prog.ios-basic-optionals.title",language:"ios",difficulty:"Basic",description:"content.prog.ios-basic-optionals.description",content:"content.prog.ios-basic-optionals.content",codeExample:`
var serverResponseCode: Int? = 404
serverResponseCode = nil
        `},{id:"ios-basic-control-flow",title:"content.prog.ios-basic-control-flow.title",language:"ios",difficulty:"Basic",description:"content.prog.ios-basic-control-flow.description",content:"content.prog.ios-basic-control-flow.content",codeExample:`
let scores = [75, 43, 103, 87, 12]
for score in scores {
    if score > 50 {
        print("Pass")
    } else {
        print("Fail")
    }
}
        `},{id:"ios-basic-collections",title:"content.prog.ios-basic-collections.title",language:"ios",difficulty:"Basic",description:"content.prog.ios-basic-collections.description",content:"content.prog.ios-basic-collections.content",codeExample:`
var shoppingList = ["Eggs", "Milk"]
var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
        `},{id:"ios-basic-functions",title:"content.prog.ios-basic-functions.title",language:"ios",difficulty:"Basic",description:"content.prog.ios-basic-functions.description",content:"content.prog.ios-basic-functions.content",codeExample:`
func greet(person: String, day: String) -> String {
    return "Hello (person), today is (day)."
}

let numbers = [1, 2, 3]
let tripled = numbers.map { $0 * 3 }
        `},{id:"ios-basic-layouts",title:"content.prog.ios-basic-layouts.title",language:"ios",difficulty:"Basic",description:"content.prog.ios-basic-layouts.description",content:"content.prog.ios-basic-layouts.content",codeExample:`
ZStack {
    Color.blue.ignoresSafeArea()
    VStack {
        Text("Top")
        HStack {
            Text("Left")
            Text("Right")
        }
    }
}
        `},{id:"ios-inter-swiftui-views",title:"content.prog.ios-inter-swiftui-views.title",language:"ios",difficulty:"Intermediate",description:"content.prog.ios-inter-swiftui-views.description",content:"content.prog.ios-inter-swiftui-views.content",codeExample:`
VStack {
    Image(systemName: "globe")
        .imageScale(.large)
        .foregroundColor(.accentColor)
    Text("Hello, world!")
}
        `},{id:"ios-inter-state",title:"content.prog.ios-inter-state.title",language:"ios",difficulty:"Intermediate",description:"content.prog.ios-inter-state.description",content:"content.prog.ios-inter-state.content",codeExample:`
struct ContentView: View {
    @State private var isPlaying: Bool = false
    var body: some View {
        Button(isPlaying ? "Pause" : "Play") {
            isPlaying.toggle()
        }
    }
}
        `},{id:"ios-inter-navigation",title:"content.prog.ios-inter-navigation.title",language:"ios",difficulty:"Intermediate",description:"content.prog.ios-inter-navigation.description",content:"content.prog.ios-inter-navigation.content",codeExample:`
NavigationStack {
    List(1...10, id: .self) { i in
        NavigationLink("Row (i)", value: i)
    }
    .navigationDestination(for: Int.self) { i in
        Text("Detail (i)")
    }
}
        `},{id:"ios-inter-lists",title:"content.prog.ios-inter-lists.title",language:"ios",difficulty:"Intermediate",description:"content.prog.ios-inter-lists.description",content:"content.prog.ios-inter-lists.content",codeExample:`
let items = ["Apple", "Banana", "Cherry"]
List(items, id: .self) { item in
    Text(item)
}

LazyVGrid(columns: [GridItem(.adaptive(minimum: 80))]) {
    ForEach(1...20, id: .self) { i in
        Text("Item (i)")
    }
}
        `},{id:"ios-inter-networking",title:"content.prog.ios-inter-networking.title",language:"ios",difficulty:"Intermediate",description:"content.prog.ios-inter-networking.description",content:"content.prog.ios-inter-networking.content",codeExample:`
struct User: Codable { let name: String }

func fetchUser() async throws -> User {
    let url = URL(string: "https://api.example.com/user")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}
        `},{id:"ios-adv-combine",title:"content.prog.ios-adv-combine.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-adv-combine.description",content:"content.prog.ios-adv-combine.content",codeExample:`
let publisher = [1, 2, 3].publisher
publisher
    .map { $0 * 10 }
    .sink(receiveValue: { print($0) })
        `},{id:"ios-adv-coredata",title:"content.prog.ios-adv-coredata.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-adv-coredata.description",content:"content.prog.ios-adv-coredata.content",codeExample:`
@FetchRequest(
    sortDescriptors: [NSSortDescriptor(keyPath: Item.timestamp, ascending: true)],
    animation: .default)
private var items: FetchedResults<Item>
        `},{id:"ios-adv-concurrency",title:"content.prog.ios-adv-concurrency.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-adv-concurrency.description",content:"content.prog.ios-adv-concurrency.content",codeExample:`
actor UserStore {
    var users: [String] = []
    func add(user: String) { users.append(user) }
}

func load() async {
    let store = UserStore()
    await store.add(user: "Alice")
}
        `},{id:"ios-adv-swiftdata",title:"content.prog.ios-adv-swiftdata.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-adv-swiftdata.description",content:"content.prog.ios-adv-swiftdata.content",codeExample:`
@Model
class Item {
    var timestamp: Date
    init(timestamp: Date) { self.timestamp = timestamp }
}

// In View
@Query var items: [Item]
        `},{id:"ios-adv-animations",title:"content.prog.ios-adv-animations.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-adv-animations.description",content:"content.prog.ios-adv-animations.content",codeExample:`
withAnimation(.spring()) {
    isExpanded.toggle()
}

// Matched Geometry
Text("Title")
    .matchedGeometryEffect(id: "title", in: namespace)
        `},{id:"ios-sys-camera",title:"content.prog.ios-sys-camera.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-sys-camera.description",content:"content.prog.ios-sys-camera.content",codeExample:`
let session = AVCaptureSession()
guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else { return }
let input = try AVCaptureDeviceInput(device: device)
session.addInput(input)
session.startRunning()
        `},{id:"ios-sys-location",title:"content.prog.ios-sys-location.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-sys-location.description",content:"content.prog.ios-sys-location.content",codeExample:`
class LocationManager: NSObject, CLLocationManagerDelegate {
    let manager = CLLocationManager()
    override init() {
        super.init()
        manager.delegate = self
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }
}
        `},{id:"ios-sys-sensors",title:"content.prog.ios-sys-sensors.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-sys-sensors.description",content:"content.prog.ios-sys-sensors.content",codeExample:`
let manager = CMMotionManager()
if manager.isAccelerometerAvailable {
    manager.startAccelerometerUpdates(to: .main) { (data, error) in
        print(data?.acceleration.x)
    }
}
        `},{id:"react-basic-components",title:"content.prog.react-basic-components.title",language:"react",difficulty:"Basic",description:"content.prog.react-basic-components.description",content:"content.prog.react-basic-components.content",codeExample:`
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
        `},{id:"react-basic-jsx",title:"content.prog.react-basic-jsx.title",language:"react",difficulty:"Basic",description:"content.prog.react-basic-jsx.description",content:"content.prog.react-basic-jsx.content",codeExample:`
const element = <h1>Hello, world!</h1>;
        `},{id:"react-inter-hooks-state",title:"content.prog.react-inter-hooks-state.title",language:"react",difficulty:"Intermediate",description:"content.prog.react-inter-hooks-state.description",content:"content.prog.react-inter-hooks-state.content",visualizerId:"react-hooks",codeExample:`
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>
        `},{id:"react-inter-hooks-effect",title:"content.prog.react-inter-hooks-effect.title",language:"react",difficulty:"Intermediate",description:"content.prog.react-inter-hooks-effect.description",content:"content.prog.react-inter-hooks-effect.content",codeExample:`
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]); // Only re-run if count changes
        `},{id:"react-adv-context",title:"content.prog.react-adv-context.title",language:"react",difficulty:"Advanced",description:"content.prog.react-adv-context.description",content:"content.prog.react-adv-context.content",codeExample:`
const ThemeContext = React.createContext('light');
// Provider
<ThemeContext.Provider value="dark">
  <Toolbar />
</ThemeContext.Provider>
// Consumer (useContext)
const theme = useContext(ThemeContext);
        `},{id:"react-adv-redux",title:"content.prog.react-adv-redux.title",language:"react",difficulty:"Advanced",description:"content.prog.react-adv-redux.description",content:"content.prog.react-adv-redux.content",codeExample:`
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 }
  }
})
        `},{id:"vue-basic-template",title:"content.prog.vue-basic-template.title",language:"vue",difficulty:"Basic",description:"content.prog.vue-basic-template.description",content:"content.prog.vue-basic-template.content",codeExample:`
<span>Message: {{ msg }}</span>
        `},{id:"vue-basic-directives",title:"content.prog.vue-basic-directives.title",language:"vue",difficulty:"Basic",description:"content.prog.vue-basic-directives.description",content:"content.prog.vue-basic-directives.content",codeExample:`
<p v-if="seen">Now you see me</p>
<li v-for="item in items">
  {{ item.message }}
</li>
        `},{id:"vue-inter-composition",title:"content.prog.vue-inter-composition.title",language:"vue",difficulty:"Intermediate",description:"content.prog.vue-inter-composition.description",content:"content.prog.vue-inter-composition.content",codeExample:`
import { ref, onMounted } from 'vue'

setup() {
  const count = ref(0)
  function increment() { count.value++ }
  return { count, increment }
}
        `},{id:"vue-inter-computed",title:"content.prog.vue-inter-computed.title",language:"vue",difficulty:"Intermediate",description:"content.prog.vue-inter-computed.description",content:"content.prog.vue-inter-computed.content",codeExample:`
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
        `},{id:"vue-adv-pinia",title:"content.prog.vue-adv-pinia.title",language:"vue",difficulty:"Advanced",description:"content.prog.vue-adv-pinia.description",content:"content.prog.vue-adv-pinia.content",codeExample:`
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ }
  }
})
        `},{id:"css-basic-selectors",title:"content.prog.css-basic-selectors.title",language:"css",difficulty:"Basic",description:"content.prog.css-basic-selectors.description",content:"content.prog.css-basic-selectors.content",codeExample:`
/* Element selector */
p { color: red; }

/* Class selector */
.my-class { font-size: 20px; }

/* ID selector */
#my-id { background: blue; }
        `},{id:"css-basic-boxmodel",title:"content.prog.css-basic-boxmodel.title",language:"css",difficulty:"Basic",description:"content.prog.css-basic-boxmodel.description",content:"content.prog.css-basic-boxmodel.content",visualizerId:"css-box-model",codeExample:`
div {
  width: 300px;
  border: 1px solid black;
  padding: 20px;
  margin: 10px;
}
        `},{id:"css-inter-flexbox",title:"content.prog.css-inter-flexbox.title",language:"css",difficulty:"Intermediate",description:"content.prog.css-inter-flexbox.description",content:"content.prog.css-inter-flexbox.content",visualizerId:"css-flexbox",codeExample:`
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
        `},{id:"css-inter-grid",title:"content.prog.css-inter-grid.title",language:"css",difficulty:"Intermediate",description:"content.prog.css-inter-grid.description",content:"content.prog.css-inter-grid.content",codeExample:`
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
        `},{id:"css-adv-animations",title:"content.prog.css-adv-animations.title",language:"css",difficulty:"Advanced",description:"content.prog.css-adv-animations.description",content:"content.prog.css-adv-animations.content",codeExample:`
@keyframes slidein {
  from { transform: translateX(0%); }
  to { transform: translateX(100%); }
}

div {
  animation: slidein 3s infinite;
}
        `},{id:"js-basic-vars",title:"content.prog.js-basic-vars.title",language:"javascript",difficulty:"Basic",description:"content.prog.js-basic-vars.description",content:"content.prog.js-basic-vars.content",codeExample:`
let x = 10;
const y = 20;
// y = 30; // Error!
        `},{id:"js-basic-functions",title:"content.prog.js-basic-functions.title",language:"javascript",difficulty:"Basic",description:"content.prog.js-basic-functions.description",content:"content.prog.js-basic-functions.content",codeExample:`
function add(a, b) {
  return a + b;
}

const multiply = (a, b) => a * b;
        `},{id:"js-inter-async",title:"content.prog.js-inter-async.title",language:"javascript",difficulty:"Intermediate",description:"content.prog.js-inter-async.description",content:"content.prog.js-inter-async.content",codeExample:`
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
        `},{id:"js-inter-dom",title:"content.prog.js-inter-dom.title",language:"javascript",difficulty:"Intermediate",description:"content.prog.js-inter-dom.description",content:"content.prog.js-inter-dom.content",codeExample:`
const btn = document.getElementById('myBtn');
btn.addEventListener('click', () => {
  btn.style.backgroundColor = 'blue';
});
        `},{id:"js-adv-closures",title:"content.prog.js-adv-closures.title",language:"javascript",difficulty:"Advanced",description:"content.prog.js-adv-closures.description",content:"content.prog.js-adv-closures.content",codeExample:`
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
console.log(add5(2)); // 7
        `},{id:"js-adv-event-loop",title:"content.prog.js-adv-event-loop.title",language:"javascript",difficulty:"Advanced",description:"content.prog.js-adv-event-loop.description",content:"content.prog.js-adv-event-loop.content",codeExample:`
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Output: 1, 4, 3, 2
        `},{id:"html-basic-semantic",title:"content.prog.html-basic-semantic.title",language:"html",difficulty:"Basic",description:"content.prog.html-basic-semantic.description",content:"content.prog.html-basic-semantic.content",codeExample:`
<main>
  <article>
    <header><h1>Title</h1></header>
    <p>Content...</p>
  </article>
</main>
        `},{id:"html-inter-forms",title:"content.prog.html-inter-forms.title",language:"html",difficulty:"Intermediate",description:"content.prog.html-inter-forms.description",content:"content.prog.html-inter-forms.content",codeExample:`
<form action="/submit">
  <label for="fname">First name:</label>
  <input type="text" id="fname" name="fname">
  <input type="submit" value="Submit">
</form>
        `},{id:"html-adv-canvas",title:"content.prog.html-adv-canvas.title",language:"html",difficulty:"Advanced",description:"content.prog.html-adv-canvas.description",content:"content.prog.html-adv-canvas.content",codeExample:`
<canvas id="myCanvas"></canvas>
<script>
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
<\/script>
        `},{id:"python-basic-syntax",title:"content.prog.python-basic-syntax.title",language:"python",difficulty:"Basic",description:"content.prog.python-basic-syntax.description",content:"content.prog.python-basic-syntax.content",codeExample:`
if 5 > 2:
  print("Five is greater than two!")
        `},{id:"python-basic-lists",title:"content.prog.python-basic-lists.title",language:"python",difficulty:"Basic",description:"content.prog.python-basic-lists.description",content:"content.prog.python-basic-lists.content",codeExample:`
mylist = ["apple", "banana"]
mydict = {"brand": "Ford", "year": 1964}
        `},{id:"python-inter-functions",title:"content.prog.python-inter-functions.title",language:"python",difficulty:"Intermediate",description:"content.prog.python-inter-functions.description",content:"content.prog.python-inter-functions.content",codeExample:`
def my_function(fname):
  print("Hello " + fname)

import math
print(math.pi)
        `},{id:"python-inter-classes",title:"content.prog.python-inter-classes.title",language:"python",difficulty:"Intermediate",description:"content.prog.python-inter-classes.description",content:"content.prog.python-inter-classes.content",codeExample:`
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

p1 = Person("John", 36)
print(p1.name)
        `},{id:"python-adv-decorators",title:"content.prog.python-adv-decorators.title",language:"python",difficulty:"Advanced",description:"content.prog.python-adv-decorators.description",content:"content.prog.python-adv-decorators.content",codeExample:`
def my_decorator(func):
    def wrapper():
        print("Before")
        func()
        print("After")
    return wrapper

@my_decorator
def say_whee():
    print("Whee!")
        `},{id:"python-adv-generators",title:"content.prog.python-adv-generators.title",language:"python",difficulty:"Advanced",description:"content.prog.python-adv-generators.description",content:"content.prog.python-adv-generators.content",codeExample:`
def reverse(data):
    for index in range(len(data)-1, -1, -1):
        yield data[index]

for char in reverse('golf'):
    print(char)
        `},{id:"android-inter-navigation",title:"content.prog.android-inter-navigation.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-navigation.description",content:"content.prog.android-inter-navigation.content",codeExample:`
navController.navigate(R.id.action_home_to_details)
        `},{id:"android-inter-retrofit",title:"content.prog.android-inter-retrofit.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-retrofit.description",content:"content.prog.android-inter-retrofit.content",codeExample:`
interface ApiService {
    @GET("users/{user}/repos")
    suspend fun listRepos(@Path("user") user: String): List<Repo>
}
        `},{id:"android-adv-workmanager",title:"content.prog.android-adv-workmanager.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-workmanager.description",content:"content.prog.android-adv-workmanager.content",codeExample:`
val uploadWorkRequest = OneTimeWorkRequestBuilder<UploadWorker>()
        .build()
WorkManager.getInstance(context).enqueue(uploadWorkRequest)
        `},{id:"android-inter-lazy-layouts",title:"content.prog.android-inter-lazy-layouts.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-lazy-layouts.description",content:"content.prog.android-inter-lazy-layouts.content",codeExample:`
LazyColumn {
    items(itemsList) { item ->
        Text(text = item.name)
    }
}
        `},{id:"android-inter-viewmodel",title:"content.prog.android-inter-viewmodel.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-viewmodel.description",content:"content.prog.android-inter-viewmodel.content",codeExample:`
class MyViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
}
        `},{id:"android-adv-flow",title:"content.prog.android-adv-flow.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-flow.description",content:"content.prog.android-adv-flow.content",codeExample:`
fun simple(): Flow<Int> = flow { // flow builder
    for (i in 1..3) {
        delay(100) // pretend we are doing something useful here
        emit(i) // emit next value
    }
}
        `},{id:"android-inter-side-effects",title:"content.prog.android-inter-side-effects.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-side-effects.description",content:"content.prog.android-inter-side-effects.content",codeExample:`
LaunchedEffect(Unit) {
    viewModel.loadData()
}
        `},{id:"android-adv-animations",title:"content.prog.android-adv-animations.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-animations.description",content:"content.prog.android-adv-animations.content",codeExample:`
var visible by remember { mutableStateOf(true) }
AnimatedVisibility(visible = visible) {
    Text(text = "Hello, world!")
}
        `},{id:"android-adv-datastore",title:"content.prog.android-adv-datastore.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-datastore.description",content:"content.prog.android-adv-datastore.content",codeExample:`
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")
        `},{id:"android-inter-permissions",title:"content.prog.android-inter-permissions.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-inter-permissions.description",content:"content.prog.android-inter-permissions.content",codeExample:`
val launcher = rememberLauncherForActivityResult(
    ActivityResultContracts.RequestPermission()
) { isGranted ->
    if (isGranted) { /* ... */ }
}
        `},{id:"android-adv-notifications",title:"content.prog.android-adv-notifications.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-notifications.description",content:"content.prog.android-adv-notifications.content",codeExample:`
val builder = NotificationCompat.Builder(context, CHANNEL_ID)
    .setSmallIcon(R.drawable.notification_icon)
    .setContentTitle("My notification")
    .setContentText("Hello World!")
    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        `},{id:"android-adv-testing",title:"content.prog.android-adv-testing.title",language:"android",difficulty:"Advanced",description:"content.prog.android-adv-testing.description",content:"content.prog.android-adv-testing.content",codeExample:`
@Test
fun myTest() {
    composeTestRule.setContent { MyAppTheme { MyScreen() } }
    composeTestRule.onNodeWithText("Hello").assertIsDisplayed()
}
        `},{id:"android-kotlin-data-sealed",title:"content.prog.android-kotlin-data-sealed.title",language:"android",difficulty:"Advanced",description:"content.prog.android-kotlin-data-sealed.description",content:"content.prog.android-kotlin-data-sealed.content",codeExample:`
data class User(val name: String, val age: Int)

sealed class UiState {
    object Loading : UiState()
    data class Success(val data: String) : UiState()
    data class Error(val exception: Throwable) : UiState()
}
        `},{id:"android-kotlin-extensions",title:"content.prog.android-kotlin-extensions.title",language:"android",difficulty:"Advanced",description:"content.prog.android-kotlin-extensions.description",content:"content.prog.android-kotlin-extensions.content",codeExample:`
fun String.removeFirstLastChar(): String =  this.substring(1, this.length - 1)

val myString = "Hello"
val result = myString.removeFirstLastChar() // "ell"
        `},{id:"android-kotlin-lambdas",title:"content.prog.android-kotlin-lambdas.title",language:"android",difficulty:"Advanced",description:"content.prog.android-kotlin-lambdas.description",content:"content.prog.android-kotlin-lambdas.content",codeExample:`
fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {
    val result = ArrayList<T>()
    for (item in this) {
        if (predicate(item)) result.add(item)
    }
    return result
}
        `},{id:"android-kotlin-generics",title:"content.prog.android-kotlin-generics.title",language:"android",difficulty:"Advanced",description:"content.prog.android-kotlin-generics.description",content:"content.prog.android-kotlin-generics.content",codeExample:`
class Box<T>(t: T) {
    var value = t
}

val box: Box<Int> = Box(1)
        `},{id:"android-compose-modifiers",title:"content.prog.android-compose-modifiers.title",language:"android",difficulty:"Advanced",description:"content.prog.android-compose-modifiers.description",content:"content.prog.android-compose-modifiers.content",codeExample:`
Box(
    modifier = Modifier
        .size(100.dp)
        .background(Color.Red)
        .padding(10.dp) // Padding applied *inside* the red background
        .background(Color.Blue) // Content inside padding has blue background
)
        `},{id:"android-compose-theming",title:"content.prog.android-compose-theming.title",language:"android",difficulty:"Advanced",description:"content.prog.android-compose-theming.description",content:"content.prog.android-compose-theming.content",codeExample:`
MaterialTheme(
    colorScheme = LightColorScheme,
    typography = Typography,
    content = content
)
        `},{id:"android-compose-gestures",title:"content.prog.android-compose-gestures.title",language:"android",difficulty:"Advanced",description:"content.prog.android-compose-gestures.description",content:"content.prog.android-compose-gestures.content",codeExample:`
Box(
    modifier = Modifier.pointerInput(Unit) {
        detectTapGestures(
            onDoubleTap = { /* Handle double tap */ },
            onLongPress = { /* Handle long press */ }
        )
    }
)
        `},{id:"android-compose-canvas",title:"content.prog.android-compose-canvas.title",language:"android",difficulty:"Advanced",description:"content.prog.android-compose-canvas.description",content:"content.prog.android-compose-canvas.content",codeExample:`
Canvas(modifier = Modifier.size(100.dp)) {
    drawCircle(Color.Blue, radius = size.minDimension / 2)
    drawLine(Color.Red, start = Offset.Zero, end = Offset(size.width, size.height))
}
        `},{id:"android-sys-camerax",title:"content.prog.android-sys-camerax.title",language:"android",difficulty:"Advanced",description:"content.prog.android-sys-camerax.description",content:"content.prog.android-sys-camerax.content",codeExample:`
val imageCapture = ImageCapture.Builder().build()
cameraProvider.bindToLifecycle(
    lifecycleOwner, 
    CameraSelector.DEFAULT_BACK_CAMERA, 
    preview, 
    imageCapture
)
        `},{id:"android-sys-location",title:"content.prog.android-sys-location.title",language:"android",difficulty:"Advanced",description:"content.prog.android-sys-location.description",content:"content.prog.android-sys-location.content",codeExample:`
fusedLocationClient.lastLocation
    .addOnSuccessListener { location : Location? ->
        // Got last known location. In some rare situations this can be null.
    }
        `},{id:"android-sys-sensors",title:"content.prog.android-sys-sensors.title",language:"android",difficulty:"Advanced",description:"content.prog.android-sys-sensors.description",content:"content.prog.android-sys-sensors.content",codeExample:`
sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        `},{id:"android-sys-services",title:"content.prog.android-sys-services.title",language:"android",difficulty:"Advanced",description:"content.prog.android-sys-services.description",content:"content.prog.android-sys-services.content",codeExample:`
class MyService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Do work here
        return START_STICKY
    }
}
        `},{id:"android-arch-mvvm",title:"content.prog.android-arch-mvvm.title",language:"android",difficulty:"Advanced",description:"content.prog.android-arch-mvvm.description",content:"content.prog.android-arch-mvvm.content",codeExample:`
class MyViewModel @Inject constructor(
    private val repository: MyRepository
) : ViewModel() {
    val data = repository.getData().stateIn(viewModelScope, ...)
}
        `},{id:"android-arch-clean",title:"content.prog.android-arch-clean.title",language:"android",difficulty:"Advanced",description:"content.prog.android-arch-clean.description",content:"content.prog.android-arch-clean.content",codeExample:`
// Domain Layer
class GetUserUseCase(private val repository: UserRepository) {
    operator fun invoke(): Flow<User> = repository.getUser()
}
        `},{id:"android-arch-repository",title:"content.prog.android-arch-repository.title",language:"android",difficulty:"Advanced",description:"content.prog.android-arch-repository.description",content:"content.prog.android-arch-repository.content",codeExample:`
class UserRepository(
    private val api: ApiService,
    private val dao: UserDao
) {
    fun getUser() = dao.getUser() // Single source of truth
}
        `},{id:"android-arch-di",title:"content.prog.android-arch-di.title",language:"android",difficulty:"Advanced",description:"content.prog.android-arch-di.description",content:"content.prog.android-arch-di.content",codeExample:`
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    fun provideApi(): ApiService = Retrofit.Builder()...build()
}
        `},{id:"android-firebase-setup",title:"content.prog.android-firebase-setup.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-firebase-setup.description",content:"content.prog.android-firebase-setup.content",codeExample:`
// In build.gradle
implementation platform('com.google.firebase:firebase-bom:32.0.0')
implementation 'com.google.firebase:firebase-analytics-ktx'
        `},{id:"android-firebase-firestore",title:"content.prog.android-firebase-firestore.title",language:"android",difficulty:"Advanced",description:"content.prog.android-firebase-firestore.description",content:"content.prog.android-firebase-firestore.content",codeExample:`
val db = Firebase.firestore
val user = hashMapOf("first" to "Ada", "last" to "Lovelace")
db.collection("users")
    .add(user)
    .addOnSuccessListener { documentReference ->
        Log.d(TAG, "DocumentSnapshot added with ID: " + documentReference.id)
    }
        `},{id:"android-firebase-crashlytics",title:"content.prog.android-firebase-crashlytics.title",language:"android",difficulty:"Intermediate",description:"content.prog.android-firebase-crashlytics.description",content:"content.prog.android-firebase-crashlytics.content",codeExample:`
// Force a crash to test
throw RuntimeException("Test Crash") // Do not do this in production!
        `},{id:"android-sec-biometric",title:"content.prog.android-sec-biometric.title",language:"android",difficulty:"Advanced",description:"content.prog.android-sec-biometric.description",content:"content.prog.android-sec-biometric.content",codeExample:`
val biometricPrompt = BiometricPrompt(this, executor, callback)
val promptInfo = BiometricPrompt.PromptInfo.Builder()
    .setTitle("Biometric login for my app")
    .setSubtitle("Log in using your biometric credential")
    .setNegativeButtonText("Use account password")
    .build()
biometricPrompt.authenticate(promptInfo)
        `},{id:"android-sec-encrypted-prefs",title:"content.prog.android-sec-encrypted-prefs.title",language:"android",difficulty:"Advanced",description:"content.prog.android-sec-encrypted-prefs.description",content:"content.prog.android-sec-encrypted-prefs.content",codeExample:`
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val sharedPreferences = EncryptedSharedPreferences.create(
    context,
    "secret_shared_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
        `},{id:"android-async-channels",title:"content.prog.android-async-channels.title",language:"android",difficulty:"Advanced",description:"content.prog.android-async-channels.description",content:"content.prog.android-async-channels.content",codeExample:`
// ViewModel
private val _events = MutableSharedFlow<Event>()
val events = _events.asSharedFlow()

suspend fun sendEvent(event: Event) {
    _events.emit(event)
}
        `},{id:"ios-arch-mvvm",title:"content.prog.ios-arch-mvvm.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-arch-mvvm.description",content:"content.prog.ios-arch-mvvm.content",codeExample:`
class UserViewModel: ObservableObject {
    @Published var user: User?
    private let repository: UserRepository
    
    func load() async {
        user = await repository.getUser()
    }
}
        `},{id:"ios-arch-clean",title:"content.prog.ios-arch-clean.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-arch-clean.description",content:"content.prog.ios-arch-clean.content",codeExample:`
protocol UserRepository {
    func getUser() async -> User
}

struct GetUserUseCase {
    let repo: UserRepository
    func execute() async -> User {
        return await repo.getUser()
    }
}
        `},{id:"ios-firebase-setup",title:"content.prog.ios-firebase-setup.title",language:"ios",difficulty:"Intermediate",description:"content.prog.ios-firebase-setup.description",content:"content.prog.ios-firebase-setup.content",codeExample:`
import FirebaseCore
import FirebaseFirestore

// AppDelegate
FirebaseApp.configure()

let db = Firestore.firestore()
try await db.collection("users").addDocument(data: ["name": "Alice"])
        `},{id:"ios-sec-keychain",title:"content.prog.ios-sec-keychain.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-sec-keychain.description",content:"content.prog.ios-sec-keychain.content",codeExample:`
let context = LAContext()
var error: NSError?

if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
    let reason = "Log in to your account"
    context.evaluatePolicy(...) { success, error in
        // Handle success
    }
}
        `},{id:"ios-inter-uikit-interop",title:"content.prog.ios-inter-uikit-interop.title",language:"ios",difficulty:"Intermediate",description:"content.prog.ios-inter-uikit-interop.description",content:"content.prog.ios-inter-uikit-interop.content",codeExample:`
struct MyView: UIViewRepresentable {
    func makeUIView(context: Context) -> UILabel {
        return UILabel()
    }
}
        `},{id:"ios-adv-testing",title:"content.prog.ios-adv-testing.title",language:"ios",difficulty:"Advanced",description:"content.prog.ios-adv-testing.description",content:"content.prog.ios-adv-testing.content",codeExample:`
func testExample() throws {
    let value = 2 + 2
    XCTAssertEqual(value, 4)
}
        `},{id:"react-inter-router",title:"content.prog.react-inter-router.title",language:"react",difficulty:"Intermediate",description:"content.prog.react-inter-router.description",content:"content.prog.react-inter-router.content",codeExample:`
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
        `},{id:"react-adv-performance",title:"content.prog.react-adv-performance.title",language:"react",difficulty:"Advanced",description:"content.prog.react-adv-performance.description",content:"content.prog.react-adv-performance.content",codeExample:`
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
        `},{id:"vue-inter-router",title:"content.prog.vue-inter-router.title",language:"vue",difficulty:"Intermediate",description:"content.prog.vue-inter-router.description",content:"content.prog.vue-inter-router.content",codeExample:`
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]
        `},{id:"vue-adv-slots",title:"content.prog.vue-adv-slots.title",language:"vue",difficulty:"Advanced",description:"content.prog.vue-adv-slots.description",content:"content.prog.vue-adv-slots.content",codeExample:`
<!-- Child -->
<div class="container">
  <slot></slot>
</div>

<!-- Parent -->
<Child>Hello via Slot</Child>
        `},{id:"js-basic-es6",title:"content.prog.js-basic-es6.title",language:"javascript",difficulty:"Basic",description:"content.prog.js-basic-es6.description",content:"content.prog.js-basic-es6.content",codeExample:`
const { name, age } = person;
const numbers = [1, ...others];
const str = \`My name is \${name}\`;
        `},{id:"js-adv-modules",title:"Modules (Import/Export)",language:"javascript",difficulty:"Advanced",description:"Organizing code.",content:"JavaScript modules allow you to break up your code into separate files.",codeExample:`
// math.js
export const add = (a, b) => a + b;

// main.js
import { add } from './math.js';
        `},{id:"python-inter-file",title:"File Handling",language:"python",difficulty:"Intermediate",description:"Reading and writing files.",content:"Python has several functions for creating, reading, updating, and deleting files.",codeExample:`
f = open("demofile.txt", "r")
print(f.read())
f.close()
        `},{id:"python-adv-exceptions",title:"Exception Handling",language:"python",difficulty:"Advanced",description:"Try, Except, Finally.",content:"When an error occurs, Python will stop and generate an error message. These exceptions can be handled using the try statement.",codeExample:`
try:
  print(x)
except NameError:
  print("Variable x is not defined")
finally:
  print("The 'try except' is finished")
        `},{id:"android-inter-datastore",title:"DataStore",language:"android",difficulty:"Intermediate",description:"Modern data persistence.",content:"Jetpack DataStore is a data storage solution that allows you to store key-value pairs or typed objects with protocol buffers.",codeExample:`
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")
        `},{id:"android-adv-notifications",title:"Notifications",language:"android",difficulty:"Advanced",description:"User engagement.",content:"A notification is a message that Android displays outside your app's UI to provide the user with reminders, communication from other people, or other timely information.",codeExample:`
val builder = NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(R.drawable.notification_icon)
        .setContentTitle("My notification")
        .setContentText("Hello World!")
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        `},{id:"ios-inter-autolayout",title:"Auto Layout",language:"ios",difficulty:"Intermediate",description:"Responsive UIs.",content:"Auto Layout dynamically calculates the size and position of all the views in your view hierarchy, based on constraints on those views.",codeExample:`
NSLayoutConstraint.activate([
    view.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    view.centerYAnchor.constraint(equalTo: view.centerYAnchor)
])
        `},{id:"ios-adv-gcd",title:"Grand Central Dispatch (GCD)",language:"ios",difficulty:"Advanced",description:"Low-level concurrency.",content:"GCD provides and manages FIFO queues to which your application can submit tasks.",codeExample:`
DispatchQueue.global(qos: .background).async {
    // Background work
    DispatchQueue.main.async {
        // Update UI
    }
}
        `},{id:"react-inter-customhooks",title:"Custom Hooks",language:"react",difficulty:"Intermediate",description:"Reusing stateful logic.",content:"Building your own Hooks lets you extract component logic into reusable functions.",codeExample:`
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  // ... subscription logic
  return isOnline;
}
        `},{id:"react-adv-errorboundaries",title:"Error Boundaries",language:"react",difficulty:"Advanced",description:"Handling errors gracefully.",content:"Error boundaries are React components that catch JavaScript errors anywhere in their child component tree.",codeExample:`
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToMyService(error, errorInfo);
  }
  // ...
}
        `},{id:"vue-inter-watchers",title:"Watchers",language:"vue",difficulty:"Intermediate",description:"Reacting to data changes.",content:'Computed properties allow us to declaratively compute derived values. However, there are cases where we need to perform "side effects" in reaction to state changes.',codeExample:`
watch(question, async (newQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
  }
})
        `},{id:"vue-adv-teleport",title:"Teleport",language:"vue",difficulty:"Advanced",description:"Rendering outside the DOM hierarchy.",content:`Teleport is a built-in component that allows us to "teleport" a part of a component's template into a DOM node that exists outside the DOM hierarchy of that component.`,codeExample:`
<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
        `},{id:"js-inter-storage",title:"Web Storage API",language:"javascript",difficulty:"Intermediate",description:"localStorage & sessionStorage.",content:"The Web Storage API provides mechanisms by which browsers can store key/value pairs, in a much more intuitive fashion than using cookies.",codeExample:`
localStorage.setItem('myCat', 'Tom');
const cat = localStorage.getItem('myCat');
localStorage.removeItem('myCat');
        `},{id:"js-adv-fetch",title:"Fetch API Deep Dive",language:"javascript",difficulty:"Advanced",description:"Advanced networking.",content:"The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline, such as requests and responses.",codeExample:`
fetch('https://example.com/profile', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
        `},{id:"css-inter-mediaqueries",title:"Media Queries",language:"css",difficulty:"Intermediate",description:"Responsive Design.",content:"Media queries are useful when you want to modify your site or app depending on a device's general type (such as print vs. screen) or specific characteristics and parameters (such as screen resolution or browser viewport width).",codeExample:`
@media (max-width: 600px) {
  .sidebar {
    display: none;
  }
}
        `},{id:"css-adv-variables",title:"CSS Variables",language:"css",difficulty:"Advanced",description:"Custom properties.",content:"Custom properties (sometimes referred to as CSS variables or cascading variables) are entities defined by CSS authors that contain specific values to be reused throughout a document.",codeExample:`
:root {
  --main-bg-color: brown;
}

element {
  background-color: var(--main-bg-color);
}
        `},{id:"html-inter-media",title:"Audio & Video",language:"html",difficulty:"Intermediate",description:"Embedded media.",content:"The HTML <audio> and <video> elements are used to embed sound and video content in documents.",codeExample:`
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
        `},{id:"html-adv-meta",title:"Meta Tags & SEO",language:"html",difficulty:"Advanced",description:"Information for search engines.",content:"The <meta> tag defines metadata about an HTML document. Metadata is data (information) about data.",codeExample:`
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Free Web tutorials">
  <meta name="keywords" content="HTML, CSS, JavaScript">
  <meta name="author" content="John Doe">
</head>
        `},{id:"python-inter-lambda",title:"Lambda Functions",language:"python",difficulty:"Intermediate",description:"Anonymous functions.",content:"A lambda function is a small anonymous function. A lambda function can take any number of arguments, but can only have one expression.",codeExample:`
x = lambda a, b : a * b
print(x(5, 6))
        `},{id:"python-adv-context",title:"Context Managers",language:"python",difficulty:"Advanced",description:'The "with" statement.',content:"Context managers allow you to allocate and release resources precisely when you want to.",codeExample:`
with open('file.txt', 'w') as f:
    f.write('hello world!')
# File is automatically closed here
        `}],W=({visualizerId:n})=>n==="css-box-model"?e.jsx(J,{}):n==="css-flexbox"?e.jsx(q,{}):n==="android-lifecycle"?e.jsx(K,{}):null,J=()=>e.jsxs("div",{className:"flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700",children:[e.jsx("h3",{className:"text-lg font-bold mb-6 text-gray-800 dark:text-white",children:"CSS Box Model Interactive"}),e.jsxs("div",{className:"relative bg-orange-100 dark:bg-orange-900/30 border-2 border-dashed border-orange-300 p-8 w-64 h-64 flex items-center justify-center",children:[e.jsx("span",{className:"absolute top-2 left-2 text-xs font-mono text-orange-600 dark:text-orange-400",children:"Margin"}),e.jsxs("div",{className:"relative bg-yellow-100 dark:bg-yellow-900/30 border-4 border-solid border-yellow-400 p-8 w-48 h-48 flex items-center justify-center",children:[e.jsx("span",{className:"absolute top-2 left-2 text-xs font-mono text-yellow-700 dark:text-yellow-500",children:"Border"}),e.jsxs("div",{className:"relative bg-green-100 dark:bg-green-900/30 border-2 border-dashed border-green-300 p-8 w-32 h-32 flex items-center justify-center",children:[e.jsx("span",{className:"absolute top-2 left-2 text-xs font-mono text-green-700 dark:text-green-500",children:"Padding"}),e.jsx("div",{className:"bg-blue-100 dark:bg-blue-900/50 w-full h-full flex items-center justify-center text-sm font-bold text-blue-800 dark:text-blue-200",children:"Content"})]})]})]})]}),q=()=>{const[n,o]=r.useState("center"),[g,c]=r.useState("center");return e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700",children:[e.jsx("h3",{className:"text-lg font-bold mb-4 text-gray-800 dark:text-white",children:"Flexbox Playground"}),e.jsxs("div",{className:"flex gap-4 mb-4 flex-wrap",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-medium text-gray-500 block mb-1",children:"Justify Content"}),e.jsxs("select",{value:n,onChange:l=>o(l.target.value),className:"bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm text-gray-800 dark:text-gray-200",children:[e.jsx("option",{value:"flex-start",children:"flex-start"}),e.jsx("option",{value:"center",children:"center"}),e.jsx("option",{value:"flex-end",children:"flex-end"}),e.jsx("option",{value:"space-between",children:"space-between"}),e.jsx("option",{value:"space-around",children:"space-around"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-medium text-gray-500 block mb-1",children:"Align Items"}),e.jsxs("select",{value:g,onChange:l=>c(l.target.value),className:"bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm text-gray-800 dark:text-gray-200",children:[e.jsx("option",{value:"flex-start",children:"flex-start"}),e.jsx("option",{value:"center",children:"center"}),e.jsx("option",{value:"flex-end",children:"flex-end"}),e.jsx("option",{value:"stretch",children:"stretch"})]})]})]}),e.jsxs("div",{className:"h-48 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex transition-all duration-300",style:{justifyContent:n,alignItems:g},children:[e.jsx("div",{className:"w-12 h-12 bg-blue-500 rounded m-1 flex items-center justify-center text-white font-bold",children:"1"}),e.jsx("div",{className:"w-12 h-16 bg-purple-500 rounded m-1 flex items-center justify-center text-white font-bold",children:"2"}),e.jsx("div",{className:"w-12 h-12 bg-pink-500 rounded m-1 flex items-center justify-center text-white font-bold",children:"3"})]})]})},K=()=>e.jsxs("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center",children:[e.jsx("h3",{className:"text-lg font-bold mb-6 text-gray-800 dark:text-white",children:"Activity Lifecycle"}),e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[["onCreate()","onStart()","onResume()"].map((n,o)=>e.jsxs(y.Fragment,{children:[e.jsx("div",{className:"w-48 py-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-center font-mono rounded-lg border border-green-200 dark:border-green-800 font-bold",children:n}),o<2&&e.jsx("div",{className:"h-4 w-px bg-gray-300 dark:bg-gray-600"})]},n)),e.jsx("div",{className:"h-4 w-px bg-gray-300 dark:bg-gray-600"}),e.jsx("div",{className:"w-48 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-center font-bold rounded-lg border border-blue-200 dark:border-blue-800",children:"Running"}),e.jsx("div",{className:"h-4 w-px bg-gray-300 dark:bg-gray-600"}),["onPause()","onStop()","onDestroy()"].map((n,o)=>e.jsxs(y.Fragment,{children:[e.jsx("div",{className:"w-48 py-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-center font-mono rounded-lg border border-red-200 dark:border-red-800 font-bold",children:n}),o<2&&e.jsx("div",{className:"h-4 w-px bg-gray-300 dark:bg-gray-600"})]},n))]})]}),te=()=>{const{t:n}=z(),[o,g]=r.useState(null),[c,l]=r.useState(null),[u,k]=r.useState(""),[m,v]=r.useState(!0),p=r.useMemo(()=>o?G.filter(t=>t.language===o).map(t=>({...t,title:n(t.title),description:n(t.description),content:n(t.content)})):[],[o,n]);y.useEffect(()=>{o&&p.length>0&&!c&&l(p[0].id)},[o,p,c]);const a=r.useMemo(()=>p.find(t=>t.id===c),[p,c]),b=r.useMemo(()=>p.filter(t=>t.title.toLowerCase().includes(u.toLowerCase())||t.description.toLowerCase().includes(u.toLowerCase())),[p,u]),j=r.useMemo(()=>{const t={};b.forEach(s=>{t[s.difficulty]||(t[s.difficulty]=[]),t[s.difficulty].push(s)});const i=["Basic","Intermediate","Advanced"],d={};return i.forEach(s=>{t[s]&&(d[s]=t[s])}),d},[b]),S=(t,i)=>{switch(t){case"Smartphone":return e.jsx(V,{className:i});case"Apple":return e.jsx(_,{className:i});case"Atom":return e.jsx(F,{className:i});case"Box":return e.jsx(h,{className:i});case"FileJson":return e.jsx(D,{className:i});case"Palette":return e.jsx(U,{className:i});case"FileCode":return e.jsx(P,{className:i});case"Terminal":return e.jsx(R,{className:i});default:return e.jsx(w,{className:i})}},A=t=>{switch(t){case"Basic":return"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";case"Intermediate":return"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";case"Advanced":return"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";default:return"bg-gray-100 text-gray-700"}};return o?e.jsxs("div",{className:"flex h-full bg-gray-50 dark:bg-gray-900 overflow-hidden relative",children:[e.jsx("button",{className:"md:hidden absolute top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md",onClick:()=>v(!m),children:m?e.jsx(C,{size:20}):e.jsx(I,{size:20})}),e.jsx(O,{mode:"wait",children:(m||window.innerWidth>=768)&&e.jsxs(x.div,{initial:{x:-300,opacity:0},animate:{x:0,opacity:1},exit:{x:-300,opacity:0},className:f("w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col absolute md:relative z-40 h-full shadow-xl md:shadow-none",!m&&"hidden md:flex"),children:[e.jsxs("div",{className:"p-6 border-b border-gray-100 dark:border-gray-700",children:[e.jsxs("button",{onClick:()=>g(null),className:"flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors",children:[e.jsx(T,{size:16}),n("tutorial.backToLanguages")]}),e.jsx("h2",{className:"text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2",children:E.find(t=>t.id===o)?.name}),e.jsxs("div",{className:"mt-4 relative",children:[e.jsx(N,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",size:14}),e.jsx("input",{type:"text",placeholder:n("tutorial.searchTopics"),value:u,onChange:t=>k(t.target.value),className:"w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"})]})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-4 space-y-6",children:Object.entries(j).map(([t,i])=>e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2",children:t}),e.jsx("div",{className:"space-y-1",children:i.map(d=>e.jsxs("button",{onClick:()=>{l(d.id),window.innerWidth<768&&v(!1)},className:f("w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group",c===d.id?"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300":"text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"),children:[e.jsx("span",{children:d.title}),c===d.id&&e.jsx(B,{size:14})]},d.id))})]},t))})]})}),e.jsx("div",{className:"flex-1 overflow-y-auto w-full md:w-auto",children:e.jsx("div",{className:"max-w-4xl mx-auto p-8 pt-16 md:pt-8 min-h-full",children:a?e.jsxs(x.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.2},children:[e.jsx("div",{className:"mb-2 flex items-center gap-2",children:e.jsx("span",{className:f("px-2.5 py-0.5 rounded-full text-xs font-medium",A(a.difficulty)),children:a.difficulty})}),e.jsx("h1",{className:"text-4xl font-bold text-gray-900 dark:text-white mb-4",children:a.title}),e.jsx("p",{className:"text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8",children:a.description}),a.visualizerId&&e.jsxs("div",{className:"mb-8",children:[e.jsxs("h3",{className:"text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white",children:[e.jsx(h,{size:20,className:"text-gray-400"}),n("tutorial.visualGuide")]}),e.jsx(W,{visualizerId:a.visualizerId})]}),e.jsxs("div",{className:"mb-8 max-w-none",children:[e.jsxs("h3",{className:"text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white",children:[e.jsx(M,{size:20,className:"text-gray-400"}),n("tutorial.guide")]}),e.jsx("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200",children:a.content})]}),a.codeExample&&e.jsxs("div",{className:"mb-8",children:[e.jsxs("h3",{className:"text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white",children:[e.jsx(w,{size:20,className:"text-gray-400"}),n("tutorial.example")]}),e.jsxs("div",{className:"rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800",children:[e.jsx("div",{className:"bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center",children:e.jsx("span",{className:"text-xs font-mono text-gray-500 uppercase",children:o})}),e.jsx(L,{language:o==="react"?"javascript":o==="android"?"kotlin":o==="ios"?"swift":o,style:H,customStyle:{margin:0,padding:"1.5rem",fontSize:"0.9rem"},children:a.codeExample.trim()})]})]})]},a.id):e.jsx("div",{className:"text-center py-20 text-gray-500",children:n("tutorial.selectTopic")})})})]}):e.jsx("div",{className:"h-full bg-gray-50 dark:bg-gray-900 p-8 overflow-y-auto",children:e.jsxs("div",{className:"max-w-6xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h1",{className:"text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4",children:n("tutorial.progTitle")}),e.jsx("p",{className:"text-xl text-gray-600 dark:text-gray-400",children:n("tutorial.progSubtitle")})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:E.map(t=>e.jsxs(x.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:()=>{g(t.id),l(null)},className:"bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4 hover:shadow-lg transition-all",children:[e.jsx("div",{className:`p-4 rounded-full bg-gray-100 dark:bg-gray-700/50 ${t.color}`,children:S(t.icon,"w-10 h-10")}),e.jsx("h3",{className:"text-lg font-bold text-gray-900 dark:text-white",children:t.name})]},t.id))})]})})};export{te as ProgrammingTutorial};
