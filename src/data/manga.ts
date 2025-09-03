export interface Manga {
  title: string
  coverId: string
  finished?: boolean
  rating?: number
}

export const mangaList = [
  {
    title: "sakamoto days",
    coverId: `9d9b04ad-9a83-49f4-8ae4-a9a3780fe9c0/da7c3323-5c3e-4e46-b33b-5a579aba4113`,
    rating: 5,
  },
  {
    title: "nano machine",
    coverId: `6e4805a6-75ab-462d-883c-4ddedb8e4df6/16406b53-9224-4639-8511-9951484ad99a`,
    finished: true,
    rating: 4,
  },
  {
    title: "solo leveling",
    coverId: `32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/e90bdc47-c8b9-4df7-b2c0-17641b645ee1`,
    finished: true,
    rating: 5,
  },
  {
    title: "blue lock",
    coverId: `4141c5dc-c525-4df5-afd7-cc7d192a832f/603ffd6b-c319-402f-960f-f18643401188`,
    rating: 5,
  },
  {
    title: "killer peter",
    coverId: `a3db9212-7e87-44ea-8264-23f914671444/f7d20894-993f-4d8c-97b5-ca896203dae2`,
    rating: 4,
  },
  {
    title: "wind breaker",
    coverId: `c1c408f6-3dec-4d62-b6b3-b57e615d933c/8b279428-fa32-49b2-bd51-4f8d4db7d420`,
    rating: 5,
  },
  {
    title: "mercenary enrollment",
    coverId: `9ecd208c-c592-4462-9f57-4d7d4a9f956f/75e7fac6-c9f4-43ce-ae0e-cbf06f28f99b`,
    finished: true,
    rating: 3,
  },
  {
    title: "the legend of the northern blade",
    coverId: `9ed16bc9-f570-4e71-8dda-aebc098b683b/8a917622-1853-47b7-9114-997da510a8a2`,
    finished: true,
    rating: 5,
  },
  {
    title: "66,666 years: advent of the dark mage",
    coverId: `cafd8f00-32c4-4fd2-b44f-0e25b9ff024b/28e20d49-b970-4e88-ac56-d54bdefe6f2b`,
    finished: true,
    rating: 3,
  },
  {
    title: "the greatest estate developer",
    coverId: `d7f56ace-cd30-48b9-8b64-afeca0077fca/c2613a1e-426f-4ee3-a6f7-caf003324dc7`,
    finished: true,
    rating: 4,
  },
  {
    title: "the fragrant flower blooms with dignity",
    coverId: `418791c0-35cf-4f87-936b-acd9cddf0989/d070482f-ba73-4f79-b42d-2c07119c5218`,
    rating: 5,
  },
  {
    title: "the beginning after the end",
    coverId: `4ada20eb-085a-491a-8c49-477ab42014d7/e12dda4b-3f8b-4df4-94de-56278ff83b97`,
    finished: true,
    rating: 4,
  },
] satisfies Manga[]
