/**
 * Plausible Analytics 事件追踪工具
 * 
 * 使用方法：
 * 1. 在组件中导入：import { trackEvent } from '@/lib/plausible'
 * 2. 调用追踪函数：trackEvent('event_name', { props })
 */

// 定义可追踪的事件类型
export type PlausibleEvent =
  | 'quiz_started'
  | 'quiz_completed'
  | 'affiliate_link_clicked'
  | 'email_captured'
  | 'pageview';

// 定义事件属性类型
export interface PlausibleEventProps {
  // 问卷相关
  quiz_id?: string;
  quiz_duration_seconds?: number;
  industry?: string;
  budget_range?: string;
  team_size?: string;
  
  // Affiliate 相关
  tool_name?: string;
  tool_category?: string;
  affiliate_position?: string;
  
  // 邮件相关
  email_source?: string;
  
  // 通用
  [key: string]: string | number | boolean | undefined;
}

/**
 * 追踪 Plausible 事件
 * 
 * @param eventName - 事件名称（预定义的事件类型）
 * @param props - 事件属性（可选）
 * 
 * @example
 * // 追踪问卷开始
 * trackEvent('quiz_started', { industry: 'ecommerce' })
 * 
 * @example
 * // 追踪 Affiliate 链接点击
 * trackEvent('affiliate_link_clicked', { 
 *   tool_name: 'Jasper',
 *   tool_category: 'writing'
 * })
 */
export function trackEvent(
  eventName: PlausibleEvent,
  props?: PlausibleEventProps
): void {
  if (typeof window === 'undefined') {
    // 服务端不执行
    return;
  }

  // 使用 Plausible 的全局函数
  const plausible = (window as any).plausible;
  
  if (typeof plausible === 'function') {
    plausible(eventName, { props });
  } else {
    // 开发环境下打印日志
    if (process.env.NODE_ENV === 'development') {
      console.log('[Plausible Event]', eventName, props);
    }
  }
}

/**
 * 追踪页面浏览（自动调用）
 */
export function trackPageview(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const plausible = (window as any).plausible;
  
  if (typeof plausible === 'function') {
    plausible('pageview');
  }
}

// 导出便捷函数
export const track = {
  quizStarted: (props?: PlausibleEventProps) => trackEvent('quiz_started', props),
  quizCompleted: (props?: PlausibleEventProps) => trackEvent('quiz_completed', props),
  affiliateLinkClicked: (props: { tool_name: string; tool_category?: string }) => 
    trackEvent('affiliate_link_clicked', props),
  emailCaptured: (props?: { email_source?: string }) => 
    trackEvent('email_captured', props),
};
