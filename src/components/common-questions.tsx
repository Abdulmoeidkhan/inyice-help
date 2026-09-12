import Link from 'next/link';
import { commonQuestions } from '@/lib/common-questions';

export function CommonQuestions() {
  return <section className="common-questions" aria-labelledby="common-questions-heading">
    <h2 id="common-questions-heading">Common questions about inYice</h2>
    {commonQuestions.map(item => <div key={item.slug}>
      <h3>{item.question}</h3><p>{item.answer}</p>
      <Link className="text-link" href={`/articles/${item.slug}`}>Read the guide →</Link>
    </div>)}
  </section>;
}
