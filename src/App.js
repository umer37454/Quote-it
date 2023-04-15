import React, { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

function App() {
  //defining state var 
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
        {isLoading ? <Loader /> : <QuotesList quotes={quotes} error={error} setQuotes={setQuotes} />}
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
          other users. <a href="https://github.com/umer37454/Quote-it" target="_blank">Github Link</a>
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
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handlePost(e) {
    e.preventDefault();

    //checking if data in form is valid or not
    if (text && category && textLength <= 200 && isValidHttpUrl(source)) {
      //uploading a fact into database
      setIsUploading(true);
      const { data: newQuote, error } = await supabase
        .from("quotes").insert([{ text, source, category }]).select();
      setIsUploading(false);

      //add new quotes 
      if (!error) setQuotes((quotes) => [newQuote[0], ...quotes]);

      //resetiting input field
      setText("");
      setSource("");
      setCategory("");

      //close the form
      setshowForm(false);
    } else {
      alert("Invalid data.. Provie the data correctly.. and make sure to include http: or https: in your url");
    }
  }

  return (
    <>
      <form className="quote-form" onSubmit={handlePost}>
        <input
          type="text" placeholder="Share a Quote under 200 character limit"
          value={text} onChange={(e) => { setText(e.target.value) }}
          disabled={isUploading}
        />
        <span>{200 - text.length}</span>
        <input
          type="text" placeholder="Trustworthy Source... include http: or https: in your url"
          value={source} onChange={(e) => { setSource(e.target.value) }}
          disabled={isUploading}
        />

        <select value={category} onChange={(e) => { setCategory(e.target.value) }} disabled={isUploading}>
          <option>Choose a category:</option>
          {CATEGORIES.map(cat => {
            return (
              <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>
            )
          })}
        </select>
        <button className="btn btn-large" disabled={isUploading}>Post</button>
      </form>
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

//loader component
function Loader() {
  return <p className="message">Loading...</p>
}

//quotelist component
function QuotesList({ quotes, error, setQuotes }) {

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
          return <Quotes key={quote.id} quote={quote} setQuotes={setQuotes} />;
        })}
      </ul>
      {!error ? <p>There are {quotes.length} quotes in the database. Add your own.</p> :
        <p>Error while loading..try again or check your internet connection</p>}
    </section >
  );
}


//quotes component rendered in quotelist
function Quotes({ quote, setQuotes }) {
  const [isUpdating, setIsupdating] = useState(false);
  const isDisputed = quote.likes + quote.dislikes < quote.false;

  async function handleVotes(colName) {
    setIsupdating(true);
    const { data: updatedQuote, error } = await supabase.from("quotes")
      .update({ [colName]: quote[colName] + 1 })
      .eq("id", quote.id)
      .select();
    setIsupdating(false);

    if (!error)
      setQuotes((quotes) => {
        return (quotes.map((q) => {
          return (q.id === quote.id ? updatedQuote[0] : q);
        }))
      });
  }

  return (
    <li className="quote">
      <p>
        {isDisputed ? <span className="disputed">[⛔️ DISPUTED]</span> : null}
        {quote.text}
        <a className="source" href={quote.source} target="blank">(Source)</a>
      </p>
      <span className="tag" style={{ backgroundColor: "#a7f3d0" }}>{quote.category}</span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVotes("likes")}
          disabled={isUpdating}>
          👍 {quote.likes}
        </button>

        <button
          onClick={() => handleVotes("dislikes")}
          disabled={isUpdating}>
          👎 {quote.dislikes}
        </button>

        <button
          onClick={() => handleVotes("false")}
          disabled={isUpdating}>
          ⛔️ {quote.false}
        </button>
      </div>
    </li>
  );
}

export default App;