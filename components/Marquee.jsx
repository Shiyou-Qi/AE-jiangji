import { TARGET_VERSIONS } from '@/lib/site';

/** 版本跑马灯：把「14 个目标版本」这件事变成看得见的一行 */
export default function Marquee() {
  const row = TARGET_VERSIONS.map((v) => (
    <span className="marquee__item" key={v}>
      <i className="marquee__dot" />
      {v}
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <div className="marquee__row">{row}</div>
        <div className="marquee__row">{row}</div>
      </div>
    </div>
  );
}
