import { Link as RouterLink } from 'react-router-dom';

import { motion } from 'framer-motion';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';

const RootStyle = styled(Page)(({ theme }) => ({
	display: 'flex',
	minHeight: '100%',
	alignItems: 'center',
	paddingTop: theme.spacing(15),
	paddingBottom: theme.spacing(10),
}));

function Page404() {
	return (
		<RootStyle title="404 Page Not Found | Minimal-UI">
			<Container>
				<MotionContainer initial="initial" open>
					<Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
						<motion.div variants={varBounceIn}>
							<Typography variant="h3" paragraph>
								Sorry, page not found!
							</Typography>
						</motion.div>
						<Typography sx={{ color: 'text.secondary' }}>
							Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
							mistyped the URL? Be sure to check your spelling.
						</Typography>

						<motion.div variants={varBounceIn}>
							<Box
								component="img"
								src="/static/illustrations/illustration_404.svg"
								sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
							/>
						</motion.div>

						<Button to="/" size="large" variant="contained" component={RouterLink}>
							Go to Home
						</Button>
					</Box>
				</MotionContainer>
			</Container>
		</RootStyle>
	);
}

// const componentConfig = {
// 	component: Page404,
// 	layout: LogoOnlyLayout,
// 	path: '*',
// 	public: false,
// 	role: [],
// 	group: null,
// 	sidebar: false,
// };

export default Page404;
