import React from 'react';
// import { ApolloProvider, Mutation } from 'react-apollo';
// import ApolloClient, {gql} from 'apollo-boost';
// import Fetch from 'react-fetch-component';
import {AppProvider, EmptyState} from '@shopify/polaris';

// const client = new ApolloClient({
//   fetchOptions: {
//     credentials: 'include', // --> we can do this because of gql proxy()!
//   },
// });
// const CREATE_PRODUCT = gql`
//   mutation CreateProduct($product: ProductInput!) {
//     productCreate(input: $product) {
//       product {
//         id
//         title
//       }
//     }
//   }
// `;

export default class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <EmptyState
          heading="Manage your deleted customers"
          action={{content: 'Edit deleted accounts'}}
          //secondaryAction={{content: 'Learn more', url: 'https://help.shopify.com'}}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>Manage your deleted paying customers.</p>
        </EmptyState>
      </AppProvider>
    );
  }
}
