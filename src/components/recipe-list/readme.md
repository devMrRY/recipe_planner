# recipe-list



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type               | Default  |
| ------------- | -------------- | ----------- | ------------------ | -------- |
| `favoriteIds` | --             |             | `string[]`         | `[]`     |
| `hideActions` | `hide-actions` |             | `boolean`          | `false`  |
| `layout`      | `layout`       |             | `"grid" \| "list"` | `'grid'` |
| `recipes`     | --             |             | `any[]`            | `[]`     |


## Dependencies

### Used by

 - [recipe-demo](../demo-app)

### Depends on

- [recipe-card](../recipe-card)

### Graph
```mermaid
graph TD;
  recipe-list --> recipe-card
  recipe-demo --> recipe-list
  style recipe-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
