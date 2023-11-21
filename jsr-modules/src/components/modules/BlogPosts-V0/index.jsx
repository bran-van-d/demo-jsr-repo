import blogIcon from './assets/blog.svg'
import StyledJSXRegistry from '../../StyledJSXRegistry.jsx';
import {
  makeFontStyle,
  makeBorderStyle,
  makeBorderHoverStyle,
  makeFontHoverStyle,
  makeSpacingStyle,
  getStyledJsx,
  getAlignmentCss,
  getRgbaColor
} from '../../../utils/makeFieldStyles.ts';
import { createExcerpt } from '../../../utils/utils.js';
import styles from './styles.module.css';

function getImageSide(hasAlternatingImage, loopIndex) {
  if (!hasAlternatingImage) {
    return 'left';
  }
  const isEvenLoop = loopIndex % 2 === 0;
  return isEvenLoop ? 'left' : 'right';
}

function getLayoutStyles(layout, groupStyle) {
  const {
    groupImage: imageStyle,
    groupPost: postStyle
  } = groupStyle;

  switch (layout) {
    case 'grid':
      return makeGridStyles(postStyle);
    case 'sideBySide':
      return makeSideBySideStyles(imageStyle);
    default:
      return {};
  }
}

function makeLayoutWrapperStyles(layout) {
  const blogPostWrapperStyles = {
    display: layout === 'sideBySide' ? 'flex' : '',
    flexDirection: layout === 'sideBySide' ? 'row' : ''
  };

  const blogPostContentWrapperStyles = {
    order: layout === 'sideBySide' ? 1 : ''
  };

  return {
    blogPostWrapperStyles,
    blogPostContentWrapperStyles,
  };
}

function makeGridStyles(postStyle) {
  const spaceBetweenPosts = postStyle.groupSpacing.spaceBetweenPosts;
  if (spaceBetweenPosts) {
    return {
      ['--grid-post-width']: `calc(50% - ${spaceBetweenPosts / 2}px)`,
      ['--grid-space-between-posts']: `${spaceBetweenPosts}px`,
      ['--grid-post-width-three-column']: `calc(33.3% - ${(spaceBetweenPosts * 2) / 3}px)`,
      ['--grid-post-width-four-column']: `calc(25% - ${(spaceBetweenPosts * 3) / 4}px)`
    };
  }
  return {
    ['--grid-post-width']: `calc(50% - 0.5rem)`,
    ['--grid-space-between-posts']: '1rem',
    ['--grid-post-width-three-column']: `calc(33.3% - 0.66rem)`,
    ['--grid-post-width-four-column']: `calc(25% - 0.75rem)`
  };
}

function makeSideBySideStyles(imageStyle) {
  const imageWidth = imageStyle.groupSize.width;
  const spaceBetweenContent = imageStyle.groupSpacing.betweenImageAndContent;
  const sideBySideStyles = {};

  /*
    Side by side styling is when the featured blog image is placed next to the blog content.
    These calculations ensure that the image and content remain side by side
    while accounting for the space between the image and content as well as the image width itself.
  */
  if (imageWidth && spaceBetweenContent) {
    sideBySideStyles['--image-wrapper-width'] = `calc(${imageWidth}% - ${spaceBetweenContent / 2}px)`;
    sideBySideStyles['--content-wrapper-width'] = `calc(${100 - imageWidth}% - ${spaceBetweenContent / 2}px)`;
  } else if (imageWidth) {
    sideBySideStyles['--image-wrapper-width'] = `calc(${imageWidth}% - 0.5rem)`;
    sideBySideStyles['--content-wrapper-width'] = `calc(${100 -imageWidth}% - 0.5rem)`;
  } else if (spaceBetweenContent) {
    sideBySideStyles['--image-wrapper-width'] = `calc(40% - ${spaceBetweenContent / 2}px)`;
    sideBySideStyles['--content-wrapper-width'] = `calc(60% - ${spaceBetweenContent / 2}px)`;
  } else {
    sideBySideStyles['--image-wrapper-width'] = `calc(40% - 0.5rem)`;
    sideBySideStyles['--content-wrapper-width'] = `calc(60% - 0.5rem)`;
  }

  return sideBySideStyles;
}

function makePostImageStyles(imageStyle, imageSide) {
  const spaceBetweenContent = imageStyle.groupSpacing.betweenImageAndContent;
  const spacingCss = spaceBetweenContent ? `${spaceBetweenContent}px` : '1rem';

  const postImageStyles = {
    ...makeSpacingStyle(imageStyle.groupSpacing.spacing)
  }
  if (imageSide === 'left') {
    postImageStyles['--margin-right'] = spacingCss;
    postImageStyles['--order'] = '1';
  } else if (imageSide === 'right') {
    postImageStyles['--margin-left'] = spacingCss;
    postImageStyles['--order'] = '2';
  }

  postImageStyles['--aspect-ratio'] = imageStyle.groupSize.aspectRatio;
  postImageStyles['--border-radius'] = imageStyle.groupCorner.radius >= 0
      ? `${imageStyle.groupCorner.radius}px`
      : '';

  return postImageStyles;
}

function makeImageOverlayStyles(groupBackgroundImage, featuredImage) {
  const overlayColor = getRgbaColor(groupBackgroundImage.color)

  const backgroundImageStyles = {
    backgroundImage: `url(${featuredImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    height: '100%',
  };

  const imageOverlayStyles = {
    backgroundColor: overlayColor ? overlayColor : 'rgba(255, 255, 255, 0.5)'
  }

  return {
    backgroundImageStyles,
    imageOverlayStyles
  };
}

function makePostStyles(postStyle) {
  const {
    groupBorder,
    groupBackground,
    groupCorner,
    groupSpacing
  } = postStyle;

  const blogPostStyle = {};

  if (groupBackground.color) {
    blogPostStyle.backgroundColor = getRgbaColor(groupBackground.color)
  }

  if (groupCorner) {
    blogPostStyle.borderRadius = `${groupCorner.radius}px`;
  }

  return {
    ...blogPostStyle,
    ...makeBorderStyle(groupBorder.border),
    ...makeSpacingStyle(groupSpacing.spacing)
  }
}

function makeContentStyles(contentStyle) {
  return { ... makeSpacingStyle(contentStyle.spacing) }
}

function makeTitleStyles(titleStyle) {
  const {
    groupText,
    groupSpacing,
    groupHover
  } = titleStyle;

  return {
    ...makeFontStyle(groupText.font),
    ...makeFontHoverStyle(groupHover.groupText.font),
    ...makeSpacingStyle(groupSpacing.spacing)
  };
}

function makeAuthorStyles(authorStyle) {
  const {
    groupText,
    groupSpacing,
    groupHover
  } = authorStyle;

  return {
    ...makeFontStyle(groupText.font),
    ...makeFontHoverStyle(groupHover.groupText.font),
    ...makeSpacingStyle(groupSpacing.spacing)
  };
}

function makeTagStyles(tagStyle) {
  const {
    groupText,
    groupBorder,
    groupSpacing,
    groupBackground,
    groupCorner,
    groupHover
  } = tagStyle;

  const postTagStyle = {};

  if (groupBackground.color) {
    postTagStyle.backgroundColor = getRgbaColor(groupBackground.color);
  }

  if (groupCorner) {
    postTagStyle.borderRadius = `${groupCorner.radius}px`;
  }

  if(groupHover.groupBackground) {
    postTagStyle.hoverBackgroundColor = getRgbaColor(groupHover.groupBackground.color)
  }

  return {
    ...postTagStyle,
    ...makeFontStyle(groupText.font),
    ...makeFontHoverStyle(groupHover.groupText.font),
    ...makeBorderStyle(groupBorder.border),
    ...makeBorderHoverStyle(groupHover.groupBorder.border),
    ...makeSpacingStyle(groupSpacing.spacing)
  };
}

function makePublishDateStyles(publishDateStyle) {
  const {
    groupText,
    groupSpacing
  } = publishDateStyle

  return {
    ...makeFontStyle(groupText.font),
    ...makeSpacingStyle(groupSpacing.spacing)
  }
}

function makeDescriptionStyles(descriptionStyle) {
  const {
    groupText,
    groupSpacing
  } = descriptionStyle

  return {
    ...makeFontStyle(groupText.font),
    ...makeSpacingStyle(groupSpacing.spacing)
  }
}

function makeButtonStyles(buttonStyle) {
  const {
    groupText,
    groupCorner,
    groupBorder,
    groupSpacing,
    groupBackground,
    groupHover,
  } = buttonStyle;

  const blogButtonStyle = {};
  if(groupCorner.radius >= 0) {
    blogButtonStyle.borderRadius = `${groupCorner.radius}px`;
  }

  if (groupBackground.color) {
    blogButtonStyle.backgroundColor = getRgbaColor(groupBackground.color);
  }
  if (groupHover.groupBackground.color) {
    blogButtonStyle.hoverBackgroundColor = getRgbaColor(groupHover.groupBackground.color);
  }

  return {
    ...blogButtonStyle,
    ...makeFontStyle(groupText.font),
    ...makeFontHoverStyle(groupHover.groupText.font),
    ...makeBorderStyle(groupBorder.border),
    ...makeBorderHoverStyle(groupHover.groupBorder.border),
    ...makeSpacingStyle(groupSpacing.spacing)
  }
}

function setStyledJsx(styleFieldGroup) {
  const {
    groupPost,
    groupContent,
    groupTitle,
    groupAuthor,
    groupTags,
    groupPublishDate,
    groupButton,
    groupDescription
  } = styleFieldGroup

  const postStyling = getStyledJsx(makePostStyles(groupPost), styles.hsBlogPost)
  const contentStyling = getStyledJsx(makeContentStyles(groupContent), styles.hsBlogPostListingContent)
  const titleStyling = getStyledJsx(makeTitleStyles(groupTitle), styles.hsBlogPostTitle);
  const authorStyling = getStyledJsx(makeAuthorStyles(groupAuthor), styles.hsBlogPostAuthor);
  const tagStyling = getStyledJsx(makeTagStyles(groupTags), styles.hsBlogPostTag);
  const publishDateStyling = getStyledJsx(makePublishDateStyles(groupPublishDate), styles.hsBlogPostPublishDate);
  const descriptionStyling = getStyledJsx(makeDescriptionStyles(groupDescription), styles.hsBlogPostDescription);
  const buttonStyling = getStyledJsx(makeButtonStyles(groupButton), styles.hsBlogPostButton);

  return `${postStyling} ${contentStyling} ${titleStyling} ${authorStyling} ${tagStyling} ${publishDateStyling} ${descriptionStyling} ${buttonStyling}`
}

const BlogPostImage = ({
  blogPost,
  layout,
  imageStyle,
  loopIndex,
  hasAlternatingImage,
  groupDefaultText,
}) => {
  const { featuredImage, absoluteUrl } = blogPost;
  const ariaLabel = `${groupDefaultText.featuredImageText} ${blogPost.featuredImageAltText}`;
  const imageSide = getImageSide(hasAlternatingImage, loopIndex);
  const imageStyles = makePostImageStyles(imageStyle, imageSide);

  return (
    <a
      data-testid="blog-post-image"
      style={imageStyles}
      href={absoluteUrl}
      aria-label={ariaLabel}
      className={layout === 'sideBySide' ? styles.hsBlogPostImageWrapperSideBySide : ''}
    >
      <img
        src={featuredImage}
        alt={blogPost.featuredImageAltText}
        className={styles.hsBlogPostListingImage}
      />
    </a>
  );
};

const BlogPostTitle = ({ blogPost, titleStyle }) => {
  const { absoluteUrl, name } = blogPost;
  const TitleHeading = titleStyle.headingLevel;

  return (
    <TitleHeading className={styles.hsBlogPostTitle}>
      <a className={styles.hsBlogPostTitle} href={absoluteUrl}>
        {name}
      </a>
    </TitleHeading>
  );
};

const BlogPostAuthor = ({
    blogPost,
    showPostAuthorImage,
    showPostAuthorName,
    authorStyle,
    groupDefaultText,
    blogListingBaseUrl
  }) => {
    const { blogAuthor } = blogPost;

    const imageBorderRadius = authorStyle.groupImage.groupCorner.radius
      ? { borderRadius: `${authorStyle.groupImage.groupCorner.radius}px` }
      : null

    const imageWrapperSize = authorStyle.groupImage.size
      ? { width: `${authorStyle.groupImage.size}px` }
      : null

    return (
      <div
        data-testid="author-wrapper"
        className={styles.hsBlogPostAuthor}
      >
        {showPostAuthorImage && blogAuthor.avatar && (
          <div
            className={styles.hsBlogPostAuthorImageWrapper}
            style={imageWrapperSize}
          >
            <img
              data-testid="author-avatar"
              className={styles.hsBlogPostAuthorImage}
              src={blogAuthor.avatar}
              loading="lazy"
              alt={groupDefaultText.authorAltText}
              style={imageBorderRadius}
            />
          </div>
        )}
        {showPostAuthorName && (
          <a
            data-testid="author-name"
            className={styles.hsBlogPostAuthor}
            href={`${blogListingBaseUrl}/author/${blogAuthor.slug}`}
          >
            {blogAuthor.displayName}
          </a>
        )}
      </div>
    );

}

const BlogPostTags = ({
  blogPost,
  tagStyle,
  blogListingBaseUrl
}) => {
  const { tagList } = blogPost;
  const postTagVariables = {
    '--spacing-between-tags': tagStyle.groupSpacing.spaceBetweenTags
      ? `${tagStyle.groupSpacing.spaceBetweenTags}px`
      : null
  };

  return (
    <div className={styles.hsBlogPostTags}>
      {tagList.map((tag, index) => {
        return (
          <a
            key={`${tag.slug}-${index}`}
            className={styles.hsBlogPostTag}
            href={`${blogListingBaseUrl}/tag/${tag.slug}`}
            style={postTagVariables}
          >
            {tag.name}
          </a>
        );
      })}
    </div>
  );
};

const BlogPostPublishDate = ({ blogPost }) => {
  const { publishDate, publishDateLocalized } = blogPost;
  return (
    <time
      className={styles.hsBlogPostPublishDate}
      dateTime={new Date(publishDate).toLocaleDateString()}
    >
      {publishDateLocalized.date}
    </time>
  );
};

const BlogPostDescription = ({ blogPost }) => {
  return (
    <p className={styles.hsBlogPostDescription}>
      {createExcerpt(blogPost.postListContent, 100)}
    </p>
  );
};

const BlogPostButton = ({
  blogPost,
  buttonStyle,
  buttonText,
  groupDefaultText,
}) => {
  const { absoluteUrl } = blogPost;
  const ariaLabel = `${groupDefaultText.readFullPostText} ${blogPost.name}`;
  const blogPostAlignment = getAlignmentCss(buttonStyle.groupAlignment);

  return (
    <div className={styles.hsBlogPostButtonWrapper} style={blogPostAlignment}>
      <a
        className={`${styles.hsBlogPostButton} button`}
        href={absoluteUrl}
        aria-label={ariaLabel}
      >
        {buttonText}
      </a>
    </div>
  );
};

const BlogPostContent = ({
  blogPost,
  layout,
  blogPostContentWrapperStyles,
  displayForEachListItem,
  buttonText,
  groupDefaultText,
  groupStyle,
  blogListingBaseUrl
}) => {
  const {
    groupTitle: titleStyle,
    groupAuthor: authorStyle,
    groupTags: tagStyle,
    groupPublishDate: publishDateStyle,
    groupDescription: descriptionStyle,
    groupButton: buttonStyle,
  } = groupStyle;

  // Content options
  const showPostTitle = displayForEachListItem.includes('title');
  const showPostAuthorName = displayForEachListItem.includes('authorName');
  const showPostAuthorImage = displayForEachListItem.includes('authorImage');
  const showPostTags = displayForEachListItem.includes('tags');
  const showPostPublishDate = displayForEachListItem.includes('publishDate');
  const showPostDescription = displayForEachListItem.includes('description');
  const showPostButton = displayForEachListItem.includes('button');

  const contentWrapperClass = layout === 'sideBySide'
      ? `${styles.hsBlogPostListingContent} ${styles.hsBlogPostContentSideBySide}`
      : `${styles.hsBlogPostListingContent}`;

  return (
    <div className={contentWrapperClass} style={blogPostContentWrapperStyles}>
      {showPostTitle && (
        <BlogPostTitle blogPost={blogPost} titleStyle={titleStyle} />
      )}
      {(showPostAuthorName || showPostAuthorImage) && (
        <BlogPostAuthor
          blogPost={blogPost}
          showPostAuthorName={showPostAuthorName}
          showPostAuthorImage={showPostAuthorImage}
          authorStyle={authorStyle}
          groupDefaultText={groupDefaultText}
          blogListingBaseUrl={blogListingBaseUrl}
        />
      )}
      {showPostTags &&
        <BlogPostTags
          blogPost={blogPost}
          tagStyle={tagStyle}
          blogListingBaseUrl={blogListingBaseUrl}
        />
      }
      {showPostPublishDate &&
        <BlogPostPublishDate
          blogPost={blogPost}
          publishDateStyle={publishDateStyle}
        />
      }
      {showPostDescription && (
        <BlogPostDescription
          blogPost={blogPost}
          descriptionStyle={descriptionStyle}
        />
      )}
      {showPostButton && (
        <BlogPostButton
          blogPost={blogPost}
          buttonText={buttonText}
          buttonStyle={buttonStyle}
          groupDefaultText={groupDefaultText}
        />
      )}
    </div>
  );
};

const BlogPost = ({
  blogPost,
  layout,
  buttonText,
  displayForEachListItem,
  useImageAsBackground,
  hasAlternatingImage,
  showPostImage,
  groupStyle,
  groupDefaultText,
  loopIndex,
  columns,
}) => {
  const {
    groupImage: imageStyle,
    groupBackgroundImage
  } = groupStyle;
  const { blogPostWrapperStyles, blogPostContentWrapperStyles } = makeLayoutWrapperStyles(layout);
  const blogPostClass = layout === 'grid'
      ? `${styles.hsBlogPost} ${styles[`hsBlogPostListingPostColumn${columns}`]}`
      : `${styles.hsBlogPost}`;
  const layoutStyle = getLayoutStyles(layout, groupStyle);
  const { featuredImage, parentBlog = {} } = blogPost;
  const blogListingBaseUrl = parentBlog.absoluteUrl;

  if (useImageAsBackground) {
    const { backgroundImageStyles, imageOverlayStyles } = makeImageOverlayStyles(groupBackgroundImage, featuredImage);
    const contentSpacing =  makeSpacingStyle(groupBackgroundImage.spacing)

    return (
      <article
        data-testid="blog-post-with-background-image"
        className={blogPostClass}
        style={{
          ...backgroundImageStyles,
          ...blogPostWrapperStyles,
          ...layoutStyle,
        }}
      >
        <div style={{ ...contentSpacing, ...imageOverlayStyles }}>
          <BlogPostContent
            blogPost={blogPost}
            layout={layout}
            blogPostContentWrapperStyles={blogPostContentWrapperStyles}
            displayForEachListItem={displayForEachListItem}
            buttonText={buttonText}
            groupDefaultText={groupDefaultText}
            groupStyle={groupStyle}
            blogListingBaseUrl={blogListingBaseUrl}
          />
        </div>
      </article>
    );
  }

  return (
    <article
      data-testid="blog-post"
      className={blogPostClass}
      style={{ ...blogPostWrapperStyles, ...layoutStyle }}
    >
      {showPostImage && featuredImage && (
        <BlogPostImage
          blogPost={blogPost}
          layout={layout}
          imageStyle={imageStyle}
          groupDefaultText={groupDefaultText}
          loopIndex={loopIndex}
          hasAlternatingImage={hasAlternatingImage}
        />
      )}
      <BlogPostContent
        blogPost={blogPost}
        layout={layout}
        blogPostContentWrapperStyles={blogPostContentWrapperStyles}
        displayForEachListItem={displayForEachListItem}
        buttonText={buttonText}
        groupDefaultText={groupDefaultText}
        groupStyle={groupStyle}
        blogListingBaseUrl={blogListingBaseUrl}
      />
    </article>
  );
};


export const Component = ({
    buttonText,
    groupDefaultText,
    displayForEachListItem,
    layout: layout,
    columns,
    alternateImage,
    fullImage,
    groupStyle,
    experimentalHublData
  }) => {
    const blogPosts = experimentalHublData || [];

    // Layout type
    const showPostImage = displayForEachListItem.includes('image');
    const hasAlternatingImage = showPostImage && layout === 'sideBySide' && alternateImage;
    const useImageAsBackground = showPostImage && layout != 'sideBySide' && fullImage;

    return (
      <StyledJSXRegistry>
        <style jsx>{`
          ${setStyledJsx(groupStyle)}
        `}</style>
        <section className={`${styles.hsBlogPostListing} ${layout === 'grid' ? styles.hsBlogPostGrid : ''}`}>
          {blogPosts.map((blogPost, loopIndex) => {
            return (
              <BlogPost
                key={blogPost.id}
                groupStyle={groupStyle}
                loopIndex={loopIndex}
                columns={columns}
                groupDefaultText={groupDefaultText}
                blogPost={blogPost}
                layout={layout}
                displayForEachListItem={displayForEachListItem}
                showPostImage={showPostImage}
                useImageAsBackground={useImageAsBackground}
                hasAlternatingImage={hasAlternatingImage}
                buttonText={buttonText}
              />
            )
          })}
        </section>
      </StyledJSXRegistry>
    );
};

export { fields } from './fields.tsx';
export const meta = {
  label: `Blog posts`,
  host_template_types: ["BLOG_LISTING"],
  icon: blogIcon,
  categories: ["blog"]
};
export { default as hublData } from './module.hubl.html?raw';

export const defaultModuleConfig = {
  moduleName: "blog_posts",
  version: 0
}
