import React from 'react'
import {
  ContentAreaHeader,
  ContentAreaHeaderTitleArea,
  ContentAreaHeaderTitle,
  ContentAreaHeaderActionArea,
  ContentAreaHeaderDescription,
} from './components/contentArea'


interface IContentAreaProps {
  title: string;
  subHeader: string;
  actions: Array<any>
}

const ContentAreaHeading: React.FC<IContentAreaProps> = ({
  title = "",
  subHeader = "",
  actions = []
}) => {
  return (
    <ContentAreaHeader>
      <ContentAreaHeaderTitleArea>
        <ContentAreaHeaderTitle>{title}</ContentAreaHeaderTitle>
        <ContentAreaHeaderDescription>{subHeader}</ContentAreaHeaderDescription>
      </ContentAreaHeaderTitleArea>
      <ContentAreaHeaderActionArea>
        {actions}
      </ContentAreaHeaderActionArea>
    </ContentAreaHeader>
  )
}

export default ContentAreaHeading