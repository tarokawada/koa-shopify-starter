import React from "react";
import {AppProvider, EmptyState} from "@shopify/polaris";

export default class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <EmptyState
          heading="Manage your deleted customers"
          action={{content: "Edit deleted accounts"}}
          //secondaryAction={{content: 'Learn more', url: 'https://help.shopify.com'}}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>Lorem Ipsum</p>
        </EmptyState>
      </AppProvider>
    );
  }
}
