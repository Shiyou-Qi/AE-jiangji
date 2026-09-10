/**
 * 品牌标识。
 *
 * 用的是完整横向 lockup（图形 + 字标 AEBack），所以它旁边不再另起一行文字 ——
 * 否则会出现「图里写着 AEBack、边上又写着 aeback」的重复。
 *
 * public/brand/aeback-lockup.png 由官方原图处理而来：透明底、去掉了原图底部的
 * 那行 slogan（在 30px 的头部里会糊成一条），图形与字标一个像素都没改。
 */
export default function Logo({ height = 30 }) {
  return (
    <img
      className="brand__mark"
      src="/brand/aeback-lockup.png"
      alt=""
      style={{ height }}
    />
  );
}
