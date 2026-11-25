// Spring renders account-specific Thymeleaf expressions after Astro builds the pages.
import {cp, mkdir, readdir} from 'node:fs/promises';
const output='../target/generated-resources/astro';
await mkdir(output+'/templates',{recursive:true});
await cp('dist/_astro',output+'/static/_astro',{recursive:true});
for (const name of await readdir('dist')) {
  if (name.endsWith('.html')) await cp('dist/'+name,output+'/templates/'+name);
}
