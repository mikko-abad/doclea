const ref = (dataURI: string) => ({
  id: 'doc',
  version: 15.3,
  pages: {
    page1: {
      id: 'page1',
      shapes: {},
      bindings: {},
    },
  },
  pageStates: {
    page1: {
      id: 'page1',
      selectedIds: [],
      currentParentId: 'page1',
      camera: {
        point: [0, 0],
        zoom: 1,
      },
    },
  },
  assets: {},
})

export const createDocument = (dataURI: string) => ({
  id: 'doc',
  name: 'New Document',
  version: 15.3,
  pages: {
    page: {
      id: 'page1',
      name: 'Page 1',
      childIndex: 1,
      shapes: {
        '0ea4e8dd-11c7-4b3d-206d-100e9ae6f560': {
          id: '0ea4e8dd-11c7-4b3d-206d-100e9ae6f560',
          type: 'image',
          name: 'Image',
          parentId: 'page',
          childIndex: 1,
          point: [697, 287],
          size: [106, 265],
          rotation: 0,
          style: {
            color: 'black',
            size: 'small',
            isFilled: false,
            dash: 'draw',
            scale: 1,
          },
          assetId: '7b4372bf-f8c8-4e99-13f7-7535ee6d913a',
        },
      },
      bindings: {},
    },
  },
  pageStates: {
    page: {
      id: 'page1',
      selectedIds: [],
      camera: {
        point: [0, 0],
        zoom: 1,
      },
      currentParentId: 'page1',
    },
  },
  assets: {
    '7b4372bf-f8c8-4e99-13f7-7535ee6d913a': {
      id: '7b4372bf-f8c8-4e99-13f7-7535ee6d913a',
      type: 'image',
      src: dataURI,
      size: [106, 265],
    },
  },
})
