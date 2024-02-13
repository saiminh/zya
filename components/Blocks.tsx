import React from 'react'
import { HeroHome } from './blocks/HeroHome'
import ContentFullSizeImgBg from './blocks/ContentFullSizeImgBg'

export const Blocks = (props) => {
  return (
    <>
    { props.blocks 
      ? props.blocks.map((block, i) => {
        switch (block.__typename) {
          case "PageBlocksHeroHome":
            return (
              <React.Fragment key={i + block.__typename}>
                <HeroHome data={block} />
              </React.Fragment>
            )
          case "PageBlocksContentFullSizeImgBg":
            return (
              <React.Fragment key={i + block.__typename}>
                <ContentFullSizeImgBg data={block} />
              </React.Fragment>
            )
        }
      }) 
      : null
    }
    </>
  )
}