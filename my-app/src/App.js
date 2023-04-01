import React, { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    likes: 24,
    dislikes: 9,
    false: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    likes: 11,
    dislikes: 2,
    false: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    likes: 8,
    dislikes: 3,
    false: 1,
    createdIn: 2015,
  },
];

function App() {
  //defining state var for form
  const [showForm, setshowForm] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function getQuotes() {
      setIsLoading(true);

      let query = supabase.from("quotes").select("*");

      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }

      const { data: quotes, error } = await query
        .order("false", { ascending: true })
        .order("likes", { ascending: false })
        .limit(1000);

      if (!error) setQuotes(quotes);
      //else alert("There was an error while loading data.. Try again after sometime..");
      else setError(true);
      setIsLoading(false);
    }
    getQuotes();
  }, [currentCategory]);

  return (
    <>
      {/* {header component} */}
      <Header showForm={showForm} setshowForm={setshowForm} />

      {/* form component rendering and set state*/}
      {showForm ? <NewQuoteForm setQuotes={setQuotes} setshowForm={setshowForm} /> : null}

      {/* {Inroduction Component} */}
      <Introduction />

      {/* {Main section - categories and quote list} */}
      <main className="main">
        <Categories setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <QuotesList quotes={quotes} error={error} />}
      </main>
    </>
  );
}

//introduction component
function Introduction() {
  return (
    <>
      <div className="introduction">
        <h3>Ansari Umer</h3>
        <p>This is a full stack responsive project made with HTML/CSS, JavaScript/React and Supabase.
          Click above "Share a quote" button to share a quote with a world. Scroll down to see quotes from
          other users.
        </p>
      </div>
    </>
  );
}

//header component & passing function from parent app to child header
function Header({ showForm, setshowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo1.png" alt="logo" />
        <h1>Quote It</h1>
      </div>

      {/* form showing button */}
      <button className="btn btn-large btn-share"
        onClick={() => { setshowForm((show) => !show) }}>
        {showForm ? "Close" : "Share a Quote"}
      </button>
    </header>
  );
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
];

//function to check if string is url - stackoverflow
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

//adding quotes form component
function NewQuoteForm({ setQuotes, setshowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  function handlePost(e) {
    //preventing form to post
    e.preventDefault();

    //checking if data in form is valid or not
    if (text && category && textLength <= 200 && isValidHttpUrl(source)) {
      //creating quote obj
      const addQuote = {
        id: Math.round(Math.random() * 100),
        text: text,
        source: source,
        category: category,
        likes: 0,
        dislikes: 0,
        false: 0,
        createdIn: new Date().getFullYear(),
      };

      //uploading a fact 
      supabase.from("quotes").insert([{ text, source, category }]);

      //add new quotes 
      setQuotes((quotes) => [addQuote, ...quotes]);

      //resetiting input field
      setText("");
      setSource("");
      setCategory("");

      //close the form
      setshowForm(false);
    } else {
      alert("Invalid data.. Please add the data correctly..");
    }
  }

  return (
    <>
      <form className="quote-form" onSubmit={handlePost}>
        <input
          type="text" placeholder="Share a Quote under 200 character limit"
          value={text} onChange={(e) => { setText(e.target.value) }}
        />
        <span>{200 - text.length}</span>
        <input
          type="text" placeholder="Trustworthy Source..."
          value={source} onChange={(e) => { setSource(e.target.value) }}
        />

        <select value={category} onChange={(e) => { setCategory(e.target.value) }}>
          <option>Choose a category:</option>
          {CATEGORIES.map(cat => {
            return (
              <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>
            )
          })}
        </select>

        <button className="btn btn-large">Post</button>
      </form>

      {/* <CategoriesHide setCategory={setCategory} category={category} /> */}
    </>
  );
}

//categories component
function Categories({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all" onClick={() => setCurrentCategory("all")}>All</button>
        </li>
        {CATEGORIES.map((cat) => {
          return (
            <li key={cat.name} className="category">
              <button className="btn btn-all" onClick={() => setCurrentCategory(cat.name)}>{cat.name}</button>
            </li>
          )
        })}
      </ul>
    </aside>
  );
}

// additional feature coming soon.....
// function CategoriesHide({ setCategory, category }) {
//   return (
//     <aside>
//       <ul>
//         {/* <li className="category">
//           <button className="btn btn-all" onClick={() => setCurrentCategory("all")}>All</button>
//         </li> */}
//         <select value={category} onChange={(e) => { setCategory(e.target.value) }}>
//           <option>Choose a category:</option>
//           {CATEGORIES.map(cat => {
//             return (
//               <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>
//             )
//           })}
//         </select>
//       </ul>
//     </aside>
//   );
// }

//loader component
function Loader() {
  return <p className="message">Loading...</p>
}

//quotelist component
function QuotesList({ quotes, error }) {

  if (quotes.length === 0) {
    return (
      <section>
        <p>There no quotes for this category. Add first quote for this category</p>
      </section>
    );
  }

  return (
    <section>
      <ul className="quote-list">
        {quotes.map((quote) => {
          return <Quotes key={quote.id} quote={quote} />;
        })}
      </ul>
      {!error ? <p>There are {quotes.length} quotes in the database. Add your own.</p> :
        <p>Error while loading..try again or check your internet connection</p>}
    </section >
  );

}

//quotes component rendered in quotelist
function Quotes({ quote }) {

  return (
    <li className="quote">
      <p>{quote.text}
        <a className="source" href={quote.source} target="blank">(Source)</a>
      </p>
      <span className="tag" style={{ backgroundColor: "#a7f3d0" }}>{quote.category}</span>
      <div className="vote-buttons">
        <button>👍 {quote.likes}</button>
        <button>👎 {quote.dislikes}</button>
        <button>⛔️ {quote.false}</button>
      </div>
    </li>
  );
}

export default App;