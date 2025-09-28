import { useEffect, useState } from "react"
import { fetchReadme } from "@common/readme_fetcher";

export default function ReadmeLoader() {
  const [readmeHtmlSnippet, setReadmeHtmlSnippet] = useState(null);
  useEffect(() => {
    fetchReadme().then(setReadmeHtmlSnippet);
  }, []);
  return (
    <div dangerouslySetInnerHTML={{__html: readmeHtmlSnippet}}>
    </div>
  )
}