module.exports = [
  {
    url: '/news/getList',
    type: 'get',
    response: config => {
      return {
        code: 20,
        data: {
          total: 100,
          items: [
            { id: 1, name: '冷雪瞳', age: 21 },
            { id: 2, name: '夏夜', age: 21 },
            { id: 3, name: '舒月舞', age: 21 },
            { id: 4, name: '冷雪瞳', age: 21 },
            { id: 5, name: '冷雪瞳', age: 21 }
          ]
        }
      }
    }
  }
]
