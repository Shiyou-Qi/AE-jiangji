/**
 * 问答列表。groups: [{ h?: string, id?: string, items: [{ q, a }] }]
 * 用原生 details，无 JS 依赖，也天然可被搜索引擎读到。
 */
export default function Faq({ groups }) {
  return (
    <div>
      {groups.map((g) => (
        <section key={g.id || g.h || 'default'} id={g.id}>
          {g.h ? (
            <h3
              className="h3"
              style={{ marginTop: g.id === groups[0].id ? 0 : 40, marginBottom: 16 }}
            >
              {g.h}
            </h3>
          ) : null}
          <div className="faq">
            {g.items.map((it) => (
              <details className="faq__item" key={it.q}>
                <summary className="faq__q">
                  <span>{it.q}</span>
                  <span className="faq__sign" aria-hidden="true" />
                </summary>
                <div className="faq__a">{it.a}</div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
