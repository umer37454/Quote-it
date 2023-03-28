import { useState } from "react";
import "./style.css";

function App() {
  //defining state var for form
  const [showForm, setshowForm] = useState(false);

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="logo1.png" alt="logo" />
          <h1>Quote It</h1>
        </div>

        {/* form showing button */}
        <button className="btn btn-large btn-share"
          onClick={() => { setshowForm((showForm) => !showForm) }}>
          Share a Quote</button>
      </header>

      {/* form rendering and set state*/}
      {showForm ? <NewQuoteForm /> : null}

      <main className="main">
        <Categories />
        <QuotesList />
      </main>
    </>
  );
}

//adding quotes form component
function NewQuoteForm() {
  return (<form className="quote-form">
    <input type="text" placeholder="Share a Quote" />
    <span>200</span>
    <input type="text" placeholder="Trustworthy Source..." />
    <select>
      <option value="">Choose a category</option>
      <option value="technology">Technology</option>
      <option value="science">Science</option>
      <option value="finance">Finance</option>
    </select>
    <button className="btn btn-large">Post</button>
  </form>);
}

//categories 
const CATEGORIES = [
  { name: "technology" },
  { name: "science" },
  { name: "finance" },
  { name: "society" },
  { name: "entertainment" },
  { name: "health" },
  { name: "history" },
  { name: "news" },
];

//categories component
function Categories() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all">All</button>
        </li>
        {CATEGORIES.map((cat) => {
          return (
            <li key={cat.name} className="category">
              <button className="btn btn-all">{cat.name}</button>
            </li>
          )
        })}
      </ul>
    </aside>
  );
}

//quotelist component
function QuotesList() {

  return <Quotes />;
}

//quotes component rendered in quotelist
function Quotes() {

  return <li></li>;
}

export default App;