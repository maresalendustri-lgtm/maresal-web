export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutMilestone {
  year: string;
  title: string;
  description: string;
}

export interface AboutCertification {
  name: string;
  description: string;
}

export interface AboutTeamMember {
  name: string;
  role: string;
  image: string;
}

export interface AboutContent {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  company_description: string;
  mission: string;
  vision: string;
  stats: AboutStat[];
  values_list: AboutValue[];
  milestones: AboutMilestone[];
  certifications: AboutCertification[];
  team_members: AboutTeamMember[];
}
