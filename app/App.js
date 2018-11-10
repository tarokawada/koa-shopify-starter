import React from 'react';
import { ApolloProvider, Mutation } from 'react-apollo';
import ApolloClient, {gql} from 'apollo-boost';
import Fetch from 'react-fetch-component';
import GameList from './components/GameList';
import {AppProvider, Page, Card, ResourceList, Avatar, TextStyle, EmptyState} from '@shopify/polaris';

// const client = new ApolloClient({
//   fetchOptions: {
//     credentials: 'include',
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
    return(
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
      // <ApolloProvider client={client}>
      //   <React.Fragment>
      // <h1>Board game loader</h1>
      //   <Fetch url="https://boardgameslist.herokuapp.com" as="json">
      //     {(fetchResults) => {
      //       if (fetchResults.loading) {
      //         return <p>Loading</p>
      //       }

      //       if (fetchResults.error) {
      //         return <p>fialed to fetch games</p>
      //       }

      //       return (
      //         <Mutation mutation={CREATE_PRODUCT}>
      //           {(createProduct, mutationResults) => {
      //             const loading = mutationResults.loading && <p>loading... </p>;

      //             const error = mutationResults.error && <p>error creating product</p>;

      //             const success = mutationResults.data && (
      //               <p>
      //                 successfully created &nbsp;
      //                 {mutationResults.data.productCreate.product.title}
      //               </p>
      //             );

      //             return (
      //               <React.Fragment>
      //                 <GameList
      //                   games={fetchResults.data}
      //                   onAddGame={(title) => {
      //                     const productInput = {
      //                       title: title,
      //                       productType: 'board game',
      //                     };

      //                     createProduct({
      //                       variables: {product: productInput},
      //                     });
      //                   }}
      //                 />
      //                 {loading}
      //                 {error}
      //                 {success}
      //               </React.Fragment>
      //             );
      //           }}
      //         </Mutation>
      //       )
      //     }}
      //   </Fetch>
      // </React.Fragment>
      // </ApolloProvider>
    )
  }
}