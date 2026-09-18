import React, { isValidElement } from "react";
import { motion } from "framer-motion";

/**
 * Recursively parses React children or strings into an array of tokens:
 * { text: string, isSpace: boolean, className?: string, style?: object, tag?: string }
 */
function extractTokens(node, inheritedProps = {}) {
  if (node === null || node === undefined || typeof node === "boolean") {
    return [];
  }

  if (typeof node === "string" || typeof node === "number") {
    const str = String(node);
    const parts = str.split(/(\s+)/);
    const tokens = [];

    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        tokens.push({ isSpace: true, text: " " });
      } else {
        tokens.push({
          isSpace: false,
          text: part,
          className: inheritedProps.className || "",
          style: inheritedProps.style,
          tag: inheritedProps.tag,
        });
      }
    });

    return tokens;
  }

  if (Array.isArray(node)) {
    return node.flatMap((child) => extractTokens(child, inheritedProps));
  }

  if (isValidElement(node)) {
    const { children, className, style, ...rest } = node.props || {};
    const combinedClass = [inheritedProps.className, className].filter(Boolean).join(" ");
    const combinedStyle = { ...inheritedProps.style, ...style };
    const tag = typeof node.type === "string" ? node.type : inheritedProps.tag;

    if (!children && children !== 0) {
      return [
        {
          isElement: true,
          element: node,
          className: combinedClass,
          style: combinedStyle,
        },
      ];
    }

    return extractTokens(children, {
      className: combinedClass,
      style: combinedStyle,
      tag,
      ...rest,
    });
  }

  return [];
}

/**
 * TextReveal Component
 * Renders text or nested JSX with word-by-word staggering reveal animation.
 */
export function TextReveal({
  children,
  as = "h2",
  className = "",
  delay = 0,
  stagger = 0.04,
  duration = 0.45,
  triggerKey,
  animateDirect = false,
  viewportMargin = "-50px",
  customWordVariants,
  ...props
}) {
  const tokens = extractTokens(children);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = customWordVariants || {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(4px)",
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const MotionComponent = motion[as] || motion.div;
  const isDirect = animateDirect || triggerKey !== undefined;

  return (
    <MotionComponent
      key={triggerKey}
      initial="hidden"
      {...(isDirect
        ? { animate: "visible" }
        : {
            whileInView: "visible",
            viewport: { once: true, margin: viewportMargin },
          })}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {tokens.map((token, idx) => {
        if (token.isSpace) {
          return <span key={`s-${idx}`}> </span>;
        }

        if (token.isElement) {
          return (
            <motion.span
              key={`el-${idx}`}
              variants={wordVariants}
              className={`inline-block align-middle ${token.className || ""}`}
              style={token.style}
            >
              {token.element}
            </motion.span>
          );
        }

        return (
          <motion.span
            key={`w-${idx}`}
            variants={wordVariants}
            className={`inline-block ${token.className || ""}`}
            style={token.style}
          >
            {token.text}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}
