import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

const imageSelector = '.single-content figure .img-container > img';

function getImageDimension(image, attrName, naturalProp, fallback) {
  return (
    Number(image.getAttribute(attrName)) ||
    image[naturalProp] ||
    Math.round(image.getBoundingClientRect()[attrName]) ||
    fallback
  );
}

function buildGalleryItems(images) {
  return images.map((image) => {
    const figure = image.closest('figure');
    const caption = figure ? figure.querySelector('figcaption') : null;

    return {
      src: image.currentSrc || image.src,
      msrc: image.currentSrc || image.src,
      alt: image.getAttribute('alt') || '',
      width: getImageDimension(image, 'width', 'naturalWidth', 1600),
      height: getImageDimension(image, 'height', 'naturalHeight', 1200),
      captionHTML: caption ? caption.innerHTML.trim() : '',
      element: image
    };
  });
}

function registerCaption(lightbox) {
  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el, pswp) => {
        const updateCaption = () => {
          const slide = pswp.currSlide;
          const captionHTML = slide?.data?.captionHTML;
          const alt = slide?.data?.alt || '';

          if (captionHTML) {
            el.innerHTML = captionHTML;
            el.hidden = false;
            return;
          }

          if (alt) {
            el.textContent = alt;
            el.hidden = false;
            return;
          }

          el.textContent = '';
          el.hidden = true;
        };

        pswp.on('change', updateCaption);
        pswp.on('firstUpdate', updateCaption);
      }
    });
  });
}

function initImageGallery() {
  const images = Array.from(document.querySelectorAll(imageSelector));

  if (!images.length) {
    return;
  }

  const galleryItems = buildGalleryItems(images);
  const lightbox = new PhotoSwipeLightbox({
    dataSource: galleryItems,
    pswpModule: PhotoSwipe,
    showHideAnimationType: 'zoom',
    bgOpacity: 0.9,
    wheelToZoom: true,
    loop: galleryItems.length > 2,
    paddingFn: (viewportSize) => {
      if (viewportSize.x < 720) {
        return { top: 24, bottom: 88, left: 16, right: 16 };
      }

      return { top: 32, bottom: 104, left: 32, right: 32 };
    }
  });

  lightbox.addFilter('thumbEl', (thumbEl, data) => data.element || thumbEl);
  lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => slide.data.msrc || placeholderSrc);

  registerCaption(lightbox);
  lightbox.init();

  images.forEach((image, index) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-haspopup', 'dialog');
    image.setAttribute(
      'aria-label',
      image.alt ? `Открыть изображение: ${image.alt}` : 'Открыть изображение'
    );

    image.addEventListener('click', () => {
      lightbox.loadAndOpen(index);
    });

    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        lightbox.loadAndOpen(index);
      }
    });
  });
}

function decodeHeadingId(hash) {
  const rawId = hash.replace(/^#/, '');

  if (!rawId) {
    return '';
  }

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
}

function initArticleToc() {
  const tocSidebar = document.querySelector('[data-toc-sidebar]');

  if (!tocSidebar) {
    return;
  }

  const tocLinks = Array.from(tocSidebar.querySelectorAll('a[href^="#"]'));
  const tocItems = tocLinks
    .map((link) => {
      const target = document.getElementById(decodeHeadingId(link.hash));

      if (!target) {
        return null;
      }

      return { link, target };
    })
    .filter(Boolean);

  if (!tocItems.length) {
    tocSidebar.hidden = true;
    return;
  }

  let activeLink = null;
  let rafId = null;

  const clearTocState = () => {
    tocLinks.forEach((link) => {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');

      const listItem = link.closest('li');

      if (listItem) {
        listItem.classList.remove('is-active', 'is-active-ancestor');
      }
    });
  };

  const setActiveLink = (nextLink) => {
    if (!nextLink || nextLink === activeLink) {
      return;
    }

    clearTocState();

    nextLink.classList.add('is-active');
    nextLink.setAttribute('aria-current', 'true');

    let listItem = nextLink.closest('li');

    if (listItem) {
      listItem.classList.add('is-active');
    }

    while (listItem) {
      listItem = listItem.parentElement?.closest('li');

      if (listItem) {
        listItem.classList.add('is-active-ancestor');
      }
    }

    nextLink.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    activeLink = nextLink;
  };

  const updateActiveLink = () => {
    const topOffset = window.scrollY + 160;
    let nextItem = tocItems[0];

    tocItems.forEach((item) => {
      if (item.target.offsetTop <= topOffset) {
        nextItem = item;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      nextItem = tocItems[tocItems.length - 1];
    }

    setActiveLink(nextItem.link);
  };

  const requestUpdate = () => {
    if (rafId !== null) {
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      updateActiveLink();
    });
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('hashchange', requestUpdate);

  tocLinks.forEach((link) => {
    link.addEventListener('click', () => {
      window.requestAnimationFrame(requestUpdate);
    });
  });

  requestUpdate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initImageGallery();
    initArticleToc();
  }, { once: true });
} else {
  initImageGallery();
  initArticleToc();
}
