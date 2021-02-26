import * as React from "react";
import { getImageSrc } from "./utils";
import "./search.css";

const API_KEY = "AIzaSyDoOinrfTeEQd6C3b9fMq8MlhzoxDKbfbo";
const SEARCH_ENGINE_ID = "018264299595958242005:dvs2adlrsca";

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      searchEngineResults: [],
      searchTerm: "classes",
      totalSearchResults: 0,
      offset: 0,
      limit: 1,
    };
  }
  componentDidMount() {
    let URL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${this.state.searchTerm}&num=${this.state.limit}&start=${this.state.offset}`;
    fetch(URL)
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          searchEngineResults: data.items,
          totalSearchResults: data?.searchInformation?.totalResults,
        })
      );
  }
  handlePagination = (e) => {
    console.log("event", e.target.innerText);
    let curPage = +e.target.innerText;
    this.setState({
      offset: curPage,
    });
    let URL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${this.state.searchTerm}&num=${this.state.limit}&start=${curPage}`;
    fetch(URL)
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          searchEngineResults: data.items,
          totalSearchResults: data?.searchInformation?.totalResults,
        })
      );
  };

  debounce = (fn, delay) => {
    let timer;
    return function () {
      let context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  };

  getData = () => {
    let URL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${this.state.searchTerm}&num=${this.state.limit}&start=${this.state.offset}`;
    fetch(URL)
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          searchEngineResults: data.items,
          totalSearchResults: data?.searchInformation?.totalResults,
        })
      );
  };

  getSearchResultsData = this.debounce(this.getData, 300);

  handleChange = (e) => {
    console.log("value is", e.target.value);
    // use debounce here to limit the rate of requests
    this.setState({ searchTerm: e.target.value });
    this.getSearchResultsData();
  };

  render() {
    const searchResults = this.state.searchEngineResults;
    const searchResultsCount = this.state.totalSearchResults;
    let paginationArray = new Array(+searchResultsCount).fill(1);

    return (
      <div>
        <div>{"Search Results"}</div>
        <div>
          <input
            type="text"
            onChange={this.handleChange}
            value={this.state.searchTerm}
            placeholder={"Enter Search term here"}
          />
        </div>
        <>
          {searchResults?.length > 0 &&
            searchResults.map((searchItem, index) => {
              let image = getImageSrc(
                searchItem?.pagemap?.cse_thumbnail ||
                  searchItem?.pagemap?.cse_image
              );
              return (
                <div className={"card"} key={`${searchItem?.title}-${index}`}>
                  <div className={"card-thumbnail"}>
                    <img
                      src={image?.src}
                      width={image?.width || 100}
                      height={image?.height || 100}
                      alt={searchItem?.title}
                    />
                  </div>
                  <div className={"card-description"}>
                    <span>{searchItem?.displayLink}</span>
                    <h2>{searchItem?.title}</h2>
                    <div>{searchItem?.snippet}</div>
                  </div>
                </div>
              );
            })}
        </>
        {searchResultsCount > 0 && (
          <div className={"pagination-container"}>
            {paginationArray.map((value, index) => {
              return (
                <button key={index} onClick={this.handlePagination}>{`${
                  index + 1
                }`}</button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
export default Search;
