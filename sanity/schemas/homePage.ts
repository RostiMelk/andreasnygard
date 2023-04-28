import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [],
  preview: {
    select: {},
    prepare(selection) {
      return {...selection}
    },
  },
})
