import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

const imageSelector = '.single-content figure .single-image__picture > img, .single-content figure .img-container > img';

function initProgressiveImages() {
  const pictures = Array.from(document.querySelectorAll('[data-progressive-image]'));

  pictures.forEach((picture) => {
    const image = picture.querySelector('img');

    if (!image) {
      return;
    }

    const markLoaded = () => {
      picture.classList.add('is-loaded');
    };

    if (image.complete && image.naturalWidth > 0) {
      markLoaded();
      return;
    }

    image.addEventListener('load', markLoaded, { once: true });
    image.addEventListener(
      'error',
      () => {
        picture.classList.add('is-error');
      },
      { once: true }
    );
  });
}

function getImageDimension(image, attrName, naturalProp, fallback) {
  return (
    Number(image.dataset[`gallery${attrName[0].toUpperCase()}${attrName.slice(1)}`]) ||
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
    const src = image.dataset.gallerySrc || image.currentSrc || image.src;

    return {
      src,
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
  const desktopSidebar = document.querySelector('[data-toc-sidebar]');
  const mobileToggle = document.querySelector('[data-toc-mobile-toggle]');
  const mobileMenu = document.querySelector('[data-toc-mobile]');
  const mobileNav = document.querySelector('[data-toc-mobile-nav]');
  const navRoots = Array.from(document.querySelectorAll('[data-toc-nav], [data-toc-mobile-nav]'));

  if (!navRoots.length) {
    return;
  }

  const primaryNav = navRoots[0];
  const tocLinks = Array.from(primaryNav.querySelectorAll('a[href^="#"]'));
  const allTocLinks = navRoots.flatMap((root) => Array.from(root.querySelectorAll('a[href^="#"]')));
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
    if (desktopSidebar) {
      desktopSidebar.hidden = true;
    }

    if (mobileToggle) {
      mobileToggle.hidden = true;
    }

    return;
  }

  let activeLink = null;
  let rafId = null;

  const clearTocState = () => {
    allTocLinks.forEach((link) => {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');

      const listItem = link.closest('li');

      if (listItem) {
        listItem.classList.remove('is-active', 'is-active-ancestor');
      }
    });
  };

  const setActiveLink = (nextId) => {
    if (!nextId || nextId === activeLink) {
      return;
    }

    clearTocState();

    allTocLinks.forEach((link) => {
      if (decodeHeadingId(link.hash) !== nextId) {
        return;
      }

      link.classList.add('is-active');
      link.setAttribute('aria-current', 'true');

      let listItem = link.closest('li');

      if (listItem) {
        listItem.classList.add('is-active');
      }

      while (listItem) {
        listItem = listItem.parentElement?.closest('li');

        if (listItem) {
          listItem.classList.add('is-active-ancestor');
        }
      }

      link.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });

    activeLink = nextId;
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

    setActiveLink(decodeHeadingId(nextItem.link.hash));
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

  const closeMobileToc = () => {
    if (!mobileMenu || mobileMenu.hidden) {
      return;
    }

    mobileMenu.hidden = true;
    document.body.classList.remove('toc-menu-open');

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  };

  const openMobileToc = () => {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.hidden = false;
    document.body.classList.add('toc-menu-open');

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1100) {
      closeMobileToc();
    }

    requestUpdate();
  });
  window.addEventListener('hashchange', requestUpdate);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileToc();
    }
  });

  allTocLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileToc();
      window.requestAnimationFrame(requestUpdate);
    });
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileMenu && !mobileMenu.hidden) {
        closeMobileToc();
        return;
      }

      openMobileToc();
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('[data-toc-mobile-close]').forEach((button) => {
      button.addEventListener('click', closeMobileToc);
    });
  }

  if (mobileNav) {
    mobileNav.addEventListener('click', (event) => {
      if (event.target.closest('a[href^="#"]')) {
        closeMobileToc();
      }
    });
  }

  requestUpdate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProgressiveImages();
    initImageGallery();
    initArticleToc();
  }, { once: true });
} else {
  initProgressiveImages();
  initImageGallery();
  initArticleToc();
}
