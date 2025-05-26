export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creator {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creator[] = [
  {
    name: 'icekele',
    avatar: '',
    username: 'icekele',
    title: '机电工程师 & 开发者',
    desc: '2022级机电工程与自动化学院学生，专注于工程技术与软件开发的融合创新',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/icekele' },
    ],
    nameAliases: ['icekele'],
    emailAliases: [],
  },
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
