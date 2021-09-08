// if deleteCount is lower than per_page, get previous page and eliminate duplicates
// if deleteCount is greater than or equal to per page
// const getNextPageToFetch = function (currentPageConfig, createCount, deleteCount) {
//   const deletedPages = Math.ceil(deleteCount / currentPageConfig.per_page);

//   currentPageConfig.page -= deletedPages;

//   return currentPageConfig;
// };

// if createCount is lower than per_page, just get the page and eliminate duplicates
// if createCount is greater than or equal to per_page, get current + Math.floor(createCount / per_page) page and eliminate duplicates
// const getNextPageToFetch = function (currentPageConfig, createCount) {
//   // compute equivalent in created pages from created items count
//   const createdPages = Math.floor(createCount / currentPageConfig.per_page);

//   // skip created pages
//   currentPageConfig.page += createdPages;

//   return currentPageConfig;
// };

const app = require('../../utils/core');

const Paginator = {
  getNextPageToFetch: function (options) {
    const config = {
      createCount: 0,
      deleteCount: 0
    };

    app.deepExtend(config, options);

    // console.log('PAGINATOR - CREATE COUNT: ', config.createCount);
    // console.log('PAGINATOR - DELETE COUNT: ', config.deleteCount);

    let pageOffset = 0,
        countDiff = config.createCount - config.deleteCount;
  
    if (countDiff === 0) {
      return config.page;
    }
  
    if (countDiff > 0) {
      pageOffset = Math.floor(Math.abs(countDiff) / config.per_page);
    } else {
      pageOffset = -Math.ceil(Math.abs(countDiff) / config.per_page);
    }

    // console.log('PAGINATOR - PAGE OFFSET: ', pageOffset);
    // console.log('PAGINATOR - PAGE: ', config.page);
    // console.log('PAGINATOR - PAGE WITH OFFSET: ', config.page + pageOffset);
  
    return config.page + pageOffset;
  },
  removeDuplicates: function (items, newItems, compareKey) {
    const duplicateItemKeys = [];

    for (const item of items) {
      for (const newItem of newItems) {
        // if duplicate found
        if (item[compareKey] === newItem[compareKey]) {
          duplicateItemKeys.push(item[compareKey]);

          // console.log('PAGINATOR - DUPLICATE FOUND: ', newItem);
          break;
        }
      }
    }

    // if any duplicates were found
    if (duplicateItemKeys.length > 0) {
      // console.log('PAGINATOR - DUPLICATE ITEM KEYS: ', duplicateItemKeys);

      const itemsWithoutDuplicates = newItems.filter((item) => {
        return !(duplicateItemKeys.includes(item[compareKey]));
      });

      // console.log('PAGINATOR - ITEMS WITHOUT DUPLICATES: ', itemsWithoutDuplicates);

      return itemsWithoutDuplicates;
    }

    // console.log('PAGINATOR - NO DUPLICATES FOUND: ', newItems);

    return newItems;
  }
};


module.exports = Paginator;