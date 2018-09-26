import React, { Component } from "react";
import ReactTable from "react-table";
import Fuse from "fuse.js";

import "./App.css";
import "react-table/react-table.css";
import data from "./customers.json";

class App extends Component {
  state = {
    customers: data,
    search: "",
    filteredCustomers: data,
    fuseFilter: {}
  };

  componentDidMount() {
    this.setState({ fuseFilter: this.fuseFilter() });
  }

  renderColumns = () => {
    return [
      { Header: "Id", accessor: "id", maxWidth: 60 },
      { Header: "Email", accessor: "email" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      {
        Header: "IP",
        accessor: "ip",
        style: { textAlign: "right" }
      },
      {
        Header: "Latitude",
        accessor: "latitude",
        style: { textAlign: "right" }
      },
      {
        Header: "Longitude",
        accessor: "longitude",
        style: { textAlign: "right" }
      },
      {
        Header: "Created At",
        accessor: "created_at",
        style: { textAlign: "right" }
      },
      { Header: "Updated At", accessor: "updated_at" }
    ];
  };

  fuseFilter = () => {
    const attributes = Object.keys(this.state.customers[0]).map(key =>
      String(key)
    );

    const options = {
      findAllMatches: true,
      keys: attributes,
      distance: 200,
      threshold: 0.1,
      tokenize: true
    };

    return new Fuse(this.state.customers, options);
  };

  renderTable = () => {
    return (
      <ReactTable
        data={this.state.filteredCustomers}
        columns={this.renderColumns()}
        defaultPageSize={10}
        className="-striped -highlight table-font"
      />
    );
  };

  onEnterPress = e => {
    const { search, fuseFilter } = this.state;

    if (this.state.search.length && e.keyCode === 13) {
      return this.setState({
        filteredCustomers: fuseFilter.search(search)
      });
    }

    if (e.keyCode === 13)
      this.setState({ filteredCustomers: this.state.customers });
  };

  onSearchClick = e => {
    const { search, fuseFilter } = this.state;

    if (this.state.search.length) {
      return this.setState({ filteredCustomers: fuseFilter.search(search) });
    }
    this.setState({ filteredCustomers: this.state.customers });
  };

  submitButtonText = () => {
    const { search, customers, filteredCustomers } = this.state;

    if (!search.length && customers !== filteredCustomers) return "Reset";

    return "Search";
  };

  render() {
    const { search } = this.state;

    return (
      <div className="App">
        <div className="search">
          <input
            className="search-input"
            type="text"
            value={search}
            onChange={e => this.setState({ search: e.target.value })}
            onKeyDown={e => this.onEnterPress(e)}
          />
          <button
            className={
              this.submitButtonText() === "Search" ? "submit" : "submit red"
            }
            onClick={e => this.onSearchClick(e)}
          >
            {this.submitButtonText()}
          </button>
        </div>
        <div className="table card">{this.renderTable()}</div>
      </div>
    );
  }
}

export default App;
