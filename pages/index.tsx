import React from "react";
import { useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import { Blocks } from "../components/Blocks";
import { Navigation } from '../components/navigation/Navigation'
import { Footer } from "../components/footer/Footer";
import { Layout } from "../components/Layout";
import { ScrollSmooth } from "../components/ScrollSmooth";

export default function Home(props) {

  // data passes through in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout
      description={data.page.meta?.description}
      title={data.page.meta?.title}
      metaimg={data.page.meta?.image}
    >
      <Navigation navData={props.nav} current={props.data.page._sys.filename} />
      <ScrollSmooth>
        <Blocks blocks={data.page.blocks} latestposts={props.latestposts} />
        <Footer navData={props.nav} />
      </ScrollSmooth>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { data, query, variables } = await client.queries.page({
    relativePath: "home.mdx",
  });

  const pagesResponse = await client.queries.blogpostConnection();
  let latestBlogPosts = pagesResponse.data.blogpostConnection.edges?.map((edge) => {
    return {
      title: edge?.node?.meta?.title,
      description: edge?.node?.meta?.description,
      image: edge?.node?.meta?.image,
      category: edge?.node?.meta?.category,
      author: edge?.node?.meta?.author,
      date: edge?.node?.meta?.date,
      filename: edge?.node?._sys.filename,
    };
  });

  
  latestBlogPosts?.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (a.date) {
      return -1;
    } else if (b.date) {
      return 1;
    } else if (a.filename && b.filename) {
      return a.filename.localeCompare(b.filename);
    }
    else {
      return 0;
    }
  });
  
  latestBlogPosts = latestBlogPosts?.slice(0, 3);

  const mainNav = await client.queries.navigation({ relativePath: 'mainnav.mdx'})

  return {
    props: {
      data,
      query,
      variables,
      nav: mainNav,
      latestposts: latestBlogPosts,
    },
  };
};
